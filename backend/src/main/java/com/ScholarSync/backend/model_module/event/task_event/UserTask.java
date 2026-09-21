package com.ScholarSync.backend.model_module.event.task_event;

import com.ScholarSync.backend.model_module.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "UserTask")
public class UserTask {
    @Column(nullable = false)
    @Id()
    private Long id;
    @Column(nullable = true)
    private String description;
    @Column(nullable = false)
    private String summary;
    @Column(nullable = true)
    private String dueDate;
    @Column(nullable = true)
    private String text;
    @Column(nullable = true)
    private Boolean completed = false;
    @Column(nullable = true)
    private String type = "checkbox";
    @Column(nullable = true)
    private String priority;
    @Column(nullable = true)
    private Integer completedUnits = 0;
    @Column(nullable = true)
    private Integer totalUnits = 10;
    @Column(nullable = true)
    private String unitLabel = "units";

    @ElementCollection
    private List<UserTaskSubtask> subtasks = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "users")
    @JsonIgnore
    private User user;

}
