package com.ScholarSync.backend.parser_module.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ScholarSync.backend.model_module.event.canvas_event.CanvasEvent;
import com.ScholarSync.backend.model_module.user.User;
import com.ScholarSync.backend.parser_module.dto.CalendarLinkRequest;
import com.ScholarSync.backend.parser_module.service.ParserService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/canvas-events")
public class ParserController {
    private ParserService parserService;

    public ParserController(ParserService parserService) {
        this.parserService = parserService;
    }

    @PostMapping("/sync")
public ResponseEntity<List<CanvasEvent>> syncEvents(
        @AuthenticationPrincipal User user, 
        @RequestBody CalendarLinkRequest rq) {
    
    String url = rq.getUrl();
    if (url == null || url.trim().isEmpty()) {
        return ResponseEntity.badRequest().build();
    }
    List<CanvasEvent> eventList = parserService.syncAndFetchCanvasEvents(url, user);
    
    if (eventList.isEmpty()) {
        return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(eventList);
}

    @GetMapping("test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("test");
    }

}
