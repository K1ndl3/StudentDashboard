package com.ScholarSync.backend.parser;
import java.io.InputStream;
import java.util.List;

import com.ScholarSync.backend.event.canvas_event.CanvasEvent;

public interface parser {
    public List<CanvasEvent> parseIcs(InputStream input);
}
