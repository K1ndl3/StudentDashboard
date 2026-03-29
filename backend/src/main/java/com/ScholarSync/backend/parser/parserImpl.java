package com.ScholarSync.backend.parser;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Component;
import net.fortuna.ical4j.model.Property;
import net.fortuna.ical4j.model.component.VEvent;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.io.InputStream;

public class parserImpl implements parser{
    
    @Override
    public void parseIcs(InputStream input) {

        // follows the builder patter
        CalendarBuilder builder = new CalendarBuilder();
        Calendar calendar = builder.build(input);

        // iterate thru calendar
        for (Object component : calendar.getComponents(Component.VEVENT)) {
            VEvent vEvent = (VEvent) component;

            // --- EXTRACT SUMMARY ---
            String summary = Optional.ofNullable(vEvent.getSummary())
                    .map(Property::getValue)
                    .orElse("No Title");

            // --- EXTRACT DESCRIPTION ---
            String description = Optional.ofNullable(vEvent.getDescription())
                    .map(Property::getValue)
                    .orElse("");

            // --- EXTRACT END DATE (DTEND) ---
            LocalDateTime endDate = null;
            if (vEvent.getEndDate() != null) {
                // iCal4j dates are usually UTC; converting to LocalDateTime
                endDate = vEvent.getEndDate().getDate().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime();
            }
        
    }
}
