package com.ScholarSync.backend.event;

public class Event {
    private Long EID;
    private String type;

    public Event() {}

    public Event(Long ID, String type) {
        this.EID = ID;
        this.type = type;   
    }
}
