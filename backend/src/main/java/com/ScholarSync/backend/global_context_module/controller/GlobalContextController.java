package com.ScholarSync.backend.global_context_module.controller;

import java.net.Authenticator;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ScholarSync.backend.global_context_module.dto.GlobalContextDTO;
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
    ResponseEntity<GlobalContextDTO> getInitialLoad(Authentication authObject) {
        // user's primary log in name is their email
        String userEmail = authObject.getName();
        GlobalContextDTO context = globalContextService.getGlobalContextDTO(userEmail);
        return ResponseEntity.ok(context);
    }

}
