package com.ScholarSync.backend.parser_module.parser_client;
import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Component;
import net.fortuna.ical4j.model.Property;
import net.fortuna.ical4j.model.component.VEvent;

import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.Temporal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import com.ScholarSync.backend.model_module.event.canvas_event.CanvasEvent;

@org.springframework.stereotype.Component
public class ParserImpl implements Parser{
    private final CalendarBuilder builder = new CalendarBuilder();
    
    @Override
    public List<CanvasEvent> parseIcs(InputStream input) {
        List<CanvasEvent> listEvent = new ArrayList<>();
        Calendar calendar = null;
        try {
            // remember to check list event is empty or not when using the parserimpl later
            calendar = builder.build(input);
        } catch (Exception e) {
            System.err.println("Error: The ICS file format is invalid. " + e.getMessage());
            return listEvent;
        }
        if (calendar == null)
        return listEvent;

        // iterate thru calendar
        for (Object component : calendar.getComponents(Component.VEVENT)) {
            VEvent vEvent = (VEvent) component;

            //EXTRACT SUMMARY
            String summary = Optional.ofNullable(vEvent.getSummary())
                    .map(Property::getValue)
                    .orElse("No Title");

            //EXTRACT DESCRIPTION
            String description = Optional.ofNullable(vEvent.getDescription())
                    .map(Property::getValue)
                    .orElse("");

            String externalId = vEvent.getUid()
                    .map(Property::getValue)
                    .orElse(null);

            // Canvas assignments normally expose their due date as DTSTART and
            // do not include DTEND. Prefer DTEND for ranged events, then fall
            // back to DTSTART so assignments are not imported with a null date.
            var endProperty = vEvent.getDateTimeEnd();
            var startProperty = vEvent.getDateTimeStart();
            Temporal dueDate = endProperty != null
                ? endProperty.getDate()
                : startProperty != null ? startProperty.getDate() : null;

            LocalDateTime endDate = toLocalDateTime(dueDate);
            CanvasEvent newEvent = new CanvasEvent(
                endDate,
                description,
                summary
            );
            newEvent.setExternalId(externalId);
            listEvent.add(newEvent);
        }
        return listEvent;
    }

    private LocalDateTime toLocalDateTime(Temporal temporal) {
        if (temporal instanceof Instant instant) {
            return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        }
        if (temporal instanceof LocalDate localDate) {
            return localDate.atStartOfDay();
        }
        if (temporal instanceof LocalDateTime localDateTime) {
            return localDateTime;
        }
        if (temporal instanceof ZonedDateTime zonedDateTime) {
            return zonedDateTime.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
        }
        if (temporal instanceof OffsetDateTime offsetDateTime) {
            return offsetDateTime.atZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
        }
        return null;
    }

}
