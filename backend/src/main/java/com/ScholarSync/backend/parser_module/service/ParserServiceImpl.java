package com.ScholarSync.backend.parser_module.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.ScholarSync.backend.model_module.event.canvas_event.CanvasEvent;
import com.ScholarSync.backend.model_module.event.canvas_event.CanvasEventRepository;
import com.ScholarSync.backend.model_module.user.User;
import com.ScholarSync.backend.model_module.user.UserDetailRepo;
import com.ScholarSync.backend.parser_module.parser_client.Parser;

import jakarta.transaction.Transactional;

@Service
public class ParserServiceImpl implements ParserService {
    private final CanvasEventRepository canvasEventRepository;
    private final Parser icsParser;
    private final RestClient client = RestClient.create();
    private final UserDetailRepo userDetailRepository;

    public ParserServiceImpl(Parser parser, CanvasEventRepository canvasEventRepository, UserDetailRepo userDetailRepo) {
        this.icsParser = parser;
        this.canvasEventRepository = canvasEventRepository;
        this.userDetailRepository = userDetailRepo;
    }

    public List<CanvasEvent> fetchAndParse(String calendarURL) {
        try {
            InputStream input = client.get()
                .uri(calendarURL)
                .retrieve()
                .body(InputStream.class);

            if (input != null) {
                return icsParser.parseIcs(input);
            }
        } catch (org.springframework.web.client.ResourceAccessException e) {
            // Triggers if the URL is wrong or internet is down
            System.err.println("Network error: Could not reach Canvas. " + e.getMessage());
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // Triggers for 404 (Not Found) or 401 (Unauthorized)
            System.err.println("HTTP error from Canvas: " + e.getStatusCode());
        } catch (Exception e) {
            // Catch-all for anything else (like a NullPointerException)
            System.err.println("An unexpected error occurred during fetch: " + e.getMessage());
        }
        return new ArrayList<>();
    }

    @Override
    @Transactional
    public List<CanvasEvent> syncAndFetchCanvasEvents(String url, User user) {
        return syncEvents(url, user, true);
    }

    @Transactional
    public List<CanvasEvent> overideEvents(String calendarURL, User user) {
        return syncEvents(calendarURL, user, true);
    }

    @Override
    @Transactional
    public List<CanvasEvent> refreshCanvasEvents(User user) {
        User persistedUser = getPersistedUser(user);
        String calendarLink = persistedUser.getCalendarLink();
        if (calendarLink == null || calendarLink.isBlank()) {
            throw new IllegalStateException("No calendar link is saved");
        }
        return syncEvents(calendarLink, persistedUser, false);
    }

    private List<CanvasEvent> syncEvents(String calendarURL, User user, boolean saveCalendarLink) {
        List<CanvasEvent> incomingEvents = fetchAndParse(calendarURL);
        if (incomingEvents.isEmpty()) {
            return new ArrayList<>();
        }

        User persistedUser = getPersistedUser(user);
        List<CanvasEvent> existingEvents =
            canvasEventRepository.findAllByUserId(persistedUser.getId());
        Map<String, CanvasEvent> eventsByExternalId = new HashMap<>();
        Map<String, CanvasEvent> legacyEventsByContent = new HashMap<>();
        Map<String, CanvasEvent> legacyEventsByUniqueSummary = new HashMap<>();
        Set<String> duplicateLegacySummaries = new HashSet<>();

        for (CanvasEvent existingEvent : existingEvents) {
            if (existingEvent.getExternalId() != null
                    && !existingEvent.getExternalId().isBlank()) {
                eventsByExternalId.putIfAbsent(existingEvent.getExternalId(), existingEvent);
            } else {
                legacyEventsByContent.putIfAbsent(contentKey(existingEvent), existingEvent);
                String summary = Objects.toString(existingEvent.getSummary(), "");
                if (legacyEventsByUniqueSummary.putIfAbsent(summary, existingEvent) != null) {
                    duplicateLegacySummaries.add(summary);
                }
            }
        }
        duplicateLegacySummaries.forEach(legacyEventsByUniqueSummary::remove);

        List<CanvasEvent> eventsToSave = new ArrayList<>();
        for (CanvasEvent incomingEvent : incomingEvents) {
            CanvasEvent target = null;
            if (incomingEvent.getExternalId() != null
                    && !incomingEvent.getExternalId().isBlank()) {
                target = eventsByExternalId.get(incomingEvent.getExternalId());
            }
            if (target == null) {
                target = legacyEventsByContent.get(contentKey(incomingEvent));
            }
            if (target == null) {
                target = legacyEventsByUniqueSummary.get(
                    Objects.toString(incomingEvent.getSummary(), "")
                );
            }
            if (target == null) {
                target = incomingEvent;
                target.setUser(persistedUser);
            } else {
                target.setExternalId(incomingEvent.getExternalId());
                target.setDueDate(incomingEvent.getDueDate());
                target.setSummary(incomingEvent.getSummary());
                target.setDescription(incomingEvent.getDescription());
            }
            eventsToSave.add(target);
        }

        if (saveCalendarLink) {
            persistedUser.setCalendarLink(calendarURL);
            userDetailRepository.save(persistedUser);
        }
        canvasEventRepository.saveAll(eventsToSave);
        return canvasEventRepository.findAllByUserId(persistedUser.getId());
    }

    private User getPersistedUser(User user) {
        return userDetailRepository.findById(user.getId())
            .orElseThrow(() -> new IllegalArgumentException("User does not exist"));
    }

    private String contentKey(CanvasEvent event) {
        return String.join(
            "\u0000",
            Objects.toString(event.getSummary(), ""),
            Objects.toString(event.getDescription(), ""),
            Objects.toString(event.getDueDate(), "")
        );
    }

    @Override
    @Transactional
    public void deleteCanvasEvent(Long eventId, User user) {
        CanvasEvent event = canvasEventRepository
            .findByIdAndUserId(eventId, user.getId())
            .orElseThrow(() -> new IllegalArgumentException("Canvas event not found"));

        canvasEventRepository.delete(event);
    }
}
