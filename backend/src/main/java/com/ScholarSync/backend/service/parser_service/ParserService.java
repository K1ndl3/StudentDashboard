package com.ScholarSync.backend.service.parser_service;

import java.util.List;
import com.ScholarSync.backend.event.canvas_event.CanvasEvent;


public interface ParserService {
    public List<CanvasEvent> fetchAndParse(String calendarURL);
}
