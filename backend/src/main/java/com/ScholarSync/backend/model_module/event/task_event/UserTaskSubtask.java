package com.ScholarSync.backend.model_module.event.task_event;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class UserTaskSubtask {
    private Long id;
    private String text;
    private Boolean completed = false;
}
