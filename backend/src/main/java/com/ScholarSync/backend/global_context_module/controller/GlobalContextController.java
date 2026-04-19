package com.ScholarSync.backend.global_context_module.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ScholarSync.backend.global_context_module.dto.GlobalContextDTO;
import com.ScholarSync.backend.global_context_module.dto.UserTaskDeleteRequest;
import com.ScholarSync.backend.global_context_module.dto.UserTaskRequest;
import com.ScholarSync.backend.global_context_module.service.GlobalContextService;

@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/context")
@RestController
public class GlobalContextController {
    private GlobalContextService globalContextService;

    public GlobalContextController(GlobalContextService globalContextService) {
        this.globalContextService = globalContextService;
    }
    @GetMapping("/load")
    public ResponseEntity<GlobalContextDTO> getInitialLoad(Authentication authObject) {
        // user's primary log in name is their email
        String userEmail = authObject.getName();
        GlobalContextDTO context = globalContextService.getGlobalContextDTO(userEmail);
        return ResponseEntity.ok(context);
    }

    @PostMapping("/save-user-tasks")
    public ResponseEntity<String> saveUserTasks(Authentication authObject,@RequestBody UserTaskRequest rq) {
        System.out.println("user saved tasks");
        String userEmail = authObject.getName();
        String response = globalContextService.saveUserTasks(userEmail
            , rq.getUserTask());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-user-task")
    public ResponseEntity<String> deleteUserTask(Authentication authObject, @RequestBody UserTaskDeleteRequest rq) {
        String userEmail = authObject.getName();
        String response = globalContextService.deleteUserTask(userEmail, rq.getId());
        return ResponseEntity.ok(response);
    }
}
