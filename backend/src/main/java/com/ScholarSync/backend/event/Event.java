package com.ScholarSync.backend.event;

public class Event {
    private Long id;
    private String type;

    public Event() {}

    public Event(Long id, String type) {
        this.id = id;
        this.type = type;   
    }
}
