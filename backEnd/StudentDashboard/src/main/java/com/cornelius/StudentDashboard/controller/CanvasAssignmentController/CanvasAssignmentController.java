package com.cornelius.StudentDashboard.controller.CanvasAssignmentController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.cornelius.StudentDashboard.dto.assignment.AssignmentCourseDTO;
import com.cornelius.StudentDashboard.service.CourseGradeService.CoursegradeService;

@RestController
public class CanvasAssignmentController {
    private final CoursegradeService service;
    CanvasAssignmentController(CoursegradeService service) { this.service = service; }

    @GetMapping("/assignment")
    public ResponseEntity<List<AssignmentCourseDTO>> getAssignments(@RequestHeader("Authorization") String AuthToken) {
        String token = AuthToken.replace("Bearer", "");
        List<AssignmentCourseDTO> Assignments = service.getAssignment(token);
        return ResponseEntity.ok(Assignments);
    }
}
