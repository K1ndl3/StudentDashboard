package com.ScholarSync.backend.parser_module.service;

import java.util.List;

import com.ScholarSync.backend.model_module.event.canvas_event.CanvasEvent;
import com.ScholarSync.backend.model_module.user.User;


public interface ParserService {
    public List<CanvasEvent> fetchAndParse(String calendarURL);
    
    public List<CanvasEvent> syncAndFetchCanvasEvents(String url, User user);

    //public List<CanvasEvent> fetchFromDb(User user);

}
