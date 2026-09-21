package com.ScholarSync.backend.parser_module.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @PostMapping({"/sync-and-override", "/syncAndOverride"})
public ResponseEntity<List<CanvasEvent>> syncAndOverride(
        @AuthenticationPrincipal User user,
        @RequestBody CalendarLinkRequest rq) {

    String url = rq.getUrl();
    if (url == null || url.trim().isEmpty()) {
        return ResponseEntity.badRequest().build();
    }
    List<CanvasEvent> eventList = parserService.overideEvents(url, user);

    if (eventList.isEmpty()) {
        return ResponseEntity.unprocessableContent().build();
    }
    return ResponseEntity.ok(eventList);
}

    @PostMapping("/refresh")
    public ResponseEntity<List<CanvasEvent>> refreshEvents(
            @AuthenticationPrincipal User user) {
        try {
            List<CanvasEvent> eventList = parserService.refreshCanvasEvents(user);
            if (eventList.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(eventList);
        } catch (IllegalStateException exception) {
            return ResponseEntity.status(409).build();
        }
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteCanvasEvent(
        @AuthenticationPrincipal User user,
        @PathVariable Long eventId
    ) {
        try {
            parserService.deleteCanvasEvent(eventId, user);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("test");
    }

}
