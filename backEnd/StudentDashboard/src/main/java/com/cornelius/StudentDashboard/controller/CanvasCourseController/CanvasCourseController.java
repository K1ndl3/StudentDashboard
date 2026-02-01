package com.cornelius.StudentDashboard.controller.CanvasCourseController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.cornelius.StudentDashboard.Exception.CanvasUnavailableException;
import com.cornelius.StudentDashboard.Exception.InsufficientScopeException;
import com.cornelius.StudentDashboard.Exception.InvalidTokenException;
import com.cornelius.StudentDashboard.dto.course.CourseDTO;
import com.cornelius.StudentDashboard.service.CourseGradeService.CoursegradeService;
@RestController
public class CanvasCourseController {
    private final CoursegradeService service;
    public CanvasCourseController(CoursegradeService service) { this.service = service; }

    @GetMapping("/courses")
    public ResponseEntity<CourseDTO[]> getCourseInfo(@RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        try {
            return ResponseEntity.ok(service.getCourseGrades(token));
        } catch (InvalidTokenException e) {
            return ResponseEntity.status(401).build();

        } catch (InsufficientScopeException e) {
            return ResponseEntity.status(403).build();

        } catch (CanvasUnavailableException e) {
            return ResponseEntity.status(503).build();
        }
    }
    
}