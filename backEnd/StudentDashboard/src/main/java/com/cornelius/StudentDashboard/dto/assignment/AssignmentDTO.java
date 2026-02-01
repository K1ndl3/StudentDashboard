package com.cornelius.StudentDashboard.dto.assignment;

public class AssignmentDTO {
    private Long id;
    private String name;
    private String due_at;
    private String description;
    private Long course_id;
    

    public AssignmentDTO() {
    }

    public AssignmentDTO(Long id, String name, String due_at, String description, Long course_id) {
        this.id = id;
        this.name = name;
        this.due_at = due_at;
        this.description = description;
        this.course_id = course_id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDue_at() {
        return due_at;
    }

    public void setDue_at(String due_at) {
        this.due_at = due_at;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCourse_id() {
        return course_id;
    }

    public void setCourse_id(Long course_id) {
        this.course_id = course_id;
    }

}