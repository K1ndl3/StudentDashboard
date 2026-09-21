package com.ScholarSync.backend.global_context_module.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ScholarSync.backend.global_context_module.dto.ArchivedNoteRequest;
import com.ScholarSync.backend.global_context_module.dto.ArchivedNoteResponse;
import com.ScholarSync.backend.global_context_module.dto.GlobalContextDTO;
import com.ScholarSync.backend.global_context_module.dto.UserNotepadRequest;
import com.ScholarSync.backend.global_context_module.dto.UserTaskDeleteRequest;
import com.ScholarSync.backend.global_context_module.dto.UserTaskRequest;
import com.ScholarSync.backend.global_context_module.service.ArchivedNoteService;
import com.ScholarSync.backend.global_context_module.service.GlobalContextService;

@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/context")
@RestController
public class GlobalContextController {
    private final GlobalContextService globalContextService;
    private final ArchivedNoteService archivedNoteService;

    public GlobalContextController(
        GlobalContextService globalContextService,
        ArchivedNoteService archivedNoteService
    ) {
        this.globalContextService = globalContextService;
        this.archivedNoteService = archivedNoteService;
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
        System.out.println("Deleted user task with id " + rq.getId() + " for user " + userEmail);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/save-notepad")
    public ResponseEntity<String> saveUserNotepad(Authentication authObject, @RequestBody UserNotepadRequest rq) {
        String userEmail = authObject.getName();
        String response = globalContextService.saveUserNotepad(userEmail, rq.getNotepad());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/archived-notes")
    public ResponseEntity<List<ArchivedNoteResponse>> getArchivedNotes(Authentication authentication) {
        return ResponseEntity.ok(archivedNoteService.findAll(authentication.getName()));
    }

    @PostMapping("/archived-notes")
    public ResponseEntity<ArchivedNoteResponse> createArchivedNote(
        Authentication authentication,
        @RequestBody ArchivedNoteRequest request
    ) {
        return ResponseEntity.ok(archivedNoteService.create(authentication.getName(), request));
    }

    @PutMapping("/archived-notes/{id}")
    public ResponseEntity<ArchivedNoteResponse> updateArchivedNote(
        Authentication authentication,
        @PathVariable Long id,
        @RequestBody ArchivedNoteRequest request
    ) {
        return ResponseEntity.ok(archivedNoteService.update(authentication.getName(), id, request));
    }

    @DeleteMapping("/archived-notes/{id}")
    public ResponseEntity<Void> deleteArchivedNote(
        Authentication authentication,
        @PathVariable Long id
    ) {
        archivedNoteService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
