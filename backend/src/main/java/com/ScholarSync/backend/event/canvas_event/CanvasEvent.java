package com.ScholarSync.backend.event.canvas_event;
import java.time.LocalDateTime;

import com.ScholarSync.backend.event.Event;

public class CanvasEvent extends Event{
    
    private LocalDateTime dueDate;
    private String summary;
    private String description;

    public CanvasEvent() {};

    public CanvasEvent(Long id, String type, LocalDateTime dueDate, String description, String summary) {
        super (id, type);
        this.dueDate = dueDate;
        this.description = description;
        this.summary = summary;
    }

    public LocalDateTime getDueDate() {
        return this.dueDate;
    }
    public String getSummary() {
        return this.summary;
    }

    public String getDescription() {
        return this.description;
    }
}
