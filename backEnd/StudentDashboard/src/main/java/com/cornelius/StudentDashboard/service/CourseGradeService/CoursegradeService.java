package com.cornelius.StudentDashboard.service.CourseGradeService;

import java.util.List;

import com.cornelius.StudentDashboard.dto.assignment.AssignmentCourseDTO;
import com.cornelius.StudentDashboard.dto.course.CourseDTO;

public interface CoursegradeService {
    public CourseDTO[] getCourseGrades(String token);
    public List<AssignmentCourseDTO> getAssignment(String token);
}
