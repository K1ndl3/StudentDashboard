package com.ScholarSync.backend.service.parser_service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.ScholarSync.backend.event.canvas_event.CanvasEvent;
import com.ScholarSync.backend.parser.Parser;

@Service
public class ParserServiceImpl implements ParserService{
    private final Parser icsParser;
    private final RestClient client = RestClient.create();

    public ParserServiceImpl(Parser parser) {
        this.icsParser = parser;
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

}
