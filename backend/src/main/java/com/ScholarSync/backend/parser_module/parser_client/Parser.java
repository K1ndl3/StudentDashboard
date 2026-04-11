package com.ScholarSync.backend.parser_module.parser_client;
import java.io.InputStream;
import java.util.List;

import com.ScholarSync.backend.model_module.event.canvas_event.CanvasEvent;
import com.ScholarSync.backend.model_module.user.User;

public interface Parser {
    public List<CanvasEvent> parseIcs(InputStream input);

}
