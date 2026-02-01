package com.cornelius.StudentDashboard.dto.assignment;

import java.util.List;

public class AssignmentCourseDTO {
    private Long courseId;
    private String courseName;
    private List<AssignmentDTO> assignments;

    public AssignmentCourseDTO() {}

    public AssignmentCourseDTO(Long courseId, String courseName, List<AssignmentDTO> assignments) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.assignments = assignments;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public List<AssignmentDTO> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<AssignmentDTO> assignments) {
        this.assignments = assignments;
    }
}
