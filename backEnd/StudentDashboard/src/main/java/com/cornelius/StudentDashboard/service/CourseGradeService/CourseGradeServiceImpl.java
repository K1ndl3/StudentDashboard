package com.cornelius.StudentDashboard.service.CourseGradeService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;

import com.cornelius.StudentDashboard.CanvasClient.CanvasClient;
import com.cornelius.StudentDashboard.dto.assignment.AssignmentCourseDTO;
import com.cornelius.StudentDashboard.dto.assignment.AssignmentDTO;
import com.cornelius.StudentDashboard.dto.course.CourseDTO;

@Service
public class CourseGradeServiceImpl implements CoursegradeService{
    private final CanvasClient client;
    CourseGradeServiceImpl(CanvasClient client) { this.client = client; }
    public CourseDTO[] getCourseGrades(String token) {
        return client.getCourseInfo(token);
    }

    public List<AssignmentCourseDTO> getAssignment(String token) {
        CourseDTO[] courses = client.getCourseInfo(token);
        List<AssignmentCourseDTO> AssignmentList = new ArrayList<>();

        for (var course : courses) {
            String name = course.getName();
            Long id = course.getId();
            List<AssignmentDTO> AssignmentFromCourseId = Arrays.asList(client.getAssignments(id, token));
            AssignmentList.add(new AssignmentCourseDTO(id, name, AssignmentFromCourseId));
        }
        return AssignmentList;
    }
}
