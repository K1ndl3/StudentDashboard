package com.ScholarSync.backend.global_context_module.dto;

import java.util.List;

import com.ScholarSync.backend.model_module.event.task_event.UserTask;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserTaskRequest {
    private List<UserTask> userTask;
}
