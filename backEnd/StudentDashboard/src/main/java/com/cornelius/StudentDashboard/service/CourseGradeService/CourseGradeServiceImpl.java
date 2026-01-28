package com.cornelius.StudentDashboard.service.CourseGradeService;

import com.cornelius.StudentDashboard.CanvasClient.CanvasClient;
import com.cornelius.StudentDashboard.dto.course.CourseDTO;

public class CourseGradeServiceImpl implements CoursegradeService{
    private final CanvasClient client;
    CourseGradeServiceImpl(CanvasClient client) { this.client = client; }
    public CourseDTO getCourseGrades(String token) {
        return client.getCourseInfo(token);
    }
}
