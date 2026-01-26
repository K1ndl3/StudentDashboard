package com.cornelius.StudentDashboard.dto.course;
import com.cornelius.StudentDashboard.dto.course.enrollment.Enrollment;

import java.util.List;

public class CourseDTO {
    private String id;
    private String name;
    private List<Enrollment> enrollments;

    public List<Enrollment> getEnrollments() {
        return enrollments;
    }

    public void setEnrollments(List<Enrollment> enrollments) {
        this.enrollments = enrollments;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CourseDTO(String id, String name, List<Enrollment> enrollments) {
        this.id = id;
        this.name = name;
        this.enrollments = enrollments;
    }

    public CourseDTO() {
    }
}
