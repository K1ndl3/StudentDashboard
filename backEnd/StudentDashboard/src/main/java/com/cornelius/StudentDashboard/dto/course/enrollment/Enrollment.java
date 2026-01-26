package com.cornelius.StudentDashboard.dto.course.enrollment;

public class Enrollment {
    private String computed_current_grade;
    private String computed_current_score;

    public String getComputed_current_grade() {
        return computed_current_grade;
    }

    public void setComputed_current_grade(String computed_current_grade) {
        this.computed_current_grade = computed_current_grade;
    }

    public String getComputed_current_score() {
        return computed_current_score;
    }

    public void setComputed_current_score(String computed_current_score) {
        this.computed_current_score = computed_current_score;
    }

    public Enrollment(String computed_current_grade, String computed_current_score) {
        this.computed_current_grade = computed_current_grade;
        this.computed_current_score = computed_current_score;
    }

    public Enrollment() {
    }
}
