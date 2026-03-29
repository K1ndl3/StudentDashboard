package com.ScholarSync.backend.parser;
import com.ScholarSync.backend.event.canvas_event.CanvasEvent;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Component;
import net.fortuna.ical4j.model.Property;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.DtEnd;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.Temporal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.io.InputStream;

public class parserImpl implements parser{
    private final AtomicLong idGenerator = new AtomicLong(1);
    @Override
    public List<CanvasEvent> parseIcs(InputStream input) {
        List<CanvasEvent> listEvent = new ArrayList<>();
        // follows the builder patter
        CalendarBuilder builder = new CalendarBuilder();
        Calendar calendar = null;
        try {
            calendar = builder.build(input);
        } catch (Exception e) {
            System.err.println("Error: The ICS file format is invalid. " + e.getMessage());
        }

        // iterate thru calendar
        for (Object component : calendar.getComponents(Component.VEVENT)) {
            Long generatedId = idGenerator.getAndIncrement();
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
            Optional<DtEnd<Temporal>> dtEndOpt = vEvent.getEndDate();

            LocalDateTime endDate = null;
            if (dtEndOpt.isPresent()) {
                // 2. Get the actual Temporal object (could be Instant, LocalDate, etc.)
                Temporal temporal = dtEndOpt.get().getDate();
                
                // 3. Convert to LocalDateTime
                if (temporal instanceof Instant instant) {
                    // If it has a timestamp (most Canvas events do)
                    endDate = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
                } else if (temporal instanceof LocalDate localDate) {
                    // If it's an "All Day" event with no specific time
                    endDate = localDate.atStartOfDay();
                }
            }   
            CanvasEvent newEvent = new CanvasEvent(
                generatedId,
                "Canvas",
                endDate,
                description,
                summary
            );
            listEvent.add(newEvent);
        }
        return listEvent;
    }
}
