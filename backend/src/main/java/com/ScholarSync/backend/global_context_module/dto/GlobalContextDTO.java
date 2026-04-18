package com.ScholarSync.backend.global_context_module.dto;

import java.util.List;

import com.ScholarSync.backend.model_module.event.canvas_event.CanvasEvent;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({ "name", "canvasEvents" })
public class GlobalContextDTO {
    private String name;
    private List<CanvasEvent> canvas_event;

}
