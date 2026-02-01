package com.cornelius.StudentDashboard.dto.course.enrollment;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Enrollment {

    @JsonProperty("computed_current_grade")
    private String computedCurrentGrade;

    @JsonProperty("computed_current_score")
    private Double computedCurrentScore;

    public Enrollment() {}

    public Enrollment(String computedCurrentGrade, Double computedCurrentScore) {
        this.computedCurrentGrade = computedCurrentGrade;
        this.computedCurrentScore = computedCurrentScore;
    }

    public String getComputedCurrentGrade() {
        return computedCurrentGrade;
    }

    public void setComputedCurrentGrade(String computedCurrentGrade) {
        this.computedCurrentGrade = computedCurrentGrade;
    }

    public Double getComputedCurrentScore() {
        return computedCurrentScore;
    }

    public void setComputedCurrentScore(Double computedCurrentScore) {
        this.computedCurrentScore = computedCurrentScore;
    }
}
