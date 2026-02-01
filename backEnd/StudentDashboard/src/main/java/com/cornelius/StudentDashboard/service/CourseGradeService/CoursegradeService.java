package com.cornelius.StudentDashboard.service.CourseGradeService;

import com.cornelius.StudentDashboard.dto.course.CourseDTO;

public interface CoursegradeService {
    public CourseDTO[] getCourseGrades(String token);
}
