package com.ScholarSync.backend.parser_module.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.ScholarSync.backend.model_module.event.canvas_event.CanvasEvent;
import com.ScholarSync.backend.model_module.event.canvas_event.CanvasEventRepository;
import com.ScholarSync.backend.model_module.user.User;
import com.ScholarSync.backend.parser_module.parser_client.Parser;

import jakarta.transaction.Transactional;

@Service
public class ParserServiceImpl implements ParserService{
    private final CanvasEventRepository canvasEventRepository;
    private final Parser icsParser;
    private final RestClient client = RestClient.create();

    public ParserServiceImpl(Parser parser, CanvasEventRepository canvasEventRepository) {
        this.icsParser = parser;
        this.canvasEventRepository = canvasEventRepository;
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
        List<CanvasEvent> list = fetchAndParse(url);
        if (list.isEmpty()) return new ArrayList<>();
        for (CanvasEvent event : list) {
            event.setUser(user);
        }
        return canvasEventRepository.saveAll(list);
    }

}
