package com.ScholarSync.backend.service.parser_service;

import java.io.InputStream;
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
        InputStream input = null;

        return icsParser.parseIcs(input);
    }

}
