package com.ScholarSync.backend;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ScholarSync.backend.event.canvas_event.CanvasEvent;
import com.ScholarSync.backend.service.parser_service.ParserService;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
    private ParserService service;

    @Test
    void testCanvasFetch() {
        String url = "https://csufullerton.instructure.com/feeds/calendars/user_woJoGAdepauLsSq8wLA60FNUFbPLhkgqMfG98eeb.ics";
        List<CanvasEvent> events = service.fetchAndParse(url);
        for (int i = 0; i < events.size(); i++) {
            System.out.println("summary" + events.get(i).getSummary());
        }
        assertNotNull(events);
        assertFalse(events.isEmpty(), "Should have found at least one assignment!");
    }

}
