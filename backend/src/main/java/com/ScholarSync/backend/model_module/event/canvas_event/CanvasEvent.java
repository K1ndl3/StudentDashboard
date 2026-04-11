package com.ScholarSync.backend.model_module.event.canvas_event;
import java.time.LocalDateTime;

import com.ScholarSync.backend.model_module.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Setter;

@Setter
@Entity
@Table(name = "Event")
public class CanvasEvent{
    @Column(nullable = false)
    @Id()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = true)
    private LocalDateTime dueDate;
    @Column(nullable = true, length = 1000)
    private String summary;
    @Column(nullable = true, columnDefinition = "TEXT" ,length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "users")
    private User user;

    public CanvasEvent() {};

    public CanvasEvent(Long id, LocalDateTime dueDate, String description, String summary) {
        this.id = id;
        this.dueDate = dueDate;
        this.description = description;
        this.summary = summary;
    }

    public CanvasEvent(LocalDateTime dueDate, String description, String summary) {
        this.dueDate = dueDate;
        this.description = description;
        this.summary = summary;
    }

    public long getId() {
        return this.id;
    }

    public LocalDateTime getDueDate() {
        return this.dueDate;
    }
    public String getSummary() {
        return this.summary;
    }

    public String getDescription() {
        return this.description;
    }

}
