package com.ScholarSync.backend.authentication;

import com.ScholarSync.backend.authentication.authService.AuthService;
import com.ScholarSync.backend.authentication.dto.LoginDTO;
import com.ScholarSync.backend.authentication.dto.RegistrationDTO;
import com.ScholarSync.backend.authentication.dto.TokenDTO;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<TokenDTO> register(@Valid @RequestBody RegistrationDTO request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> authenticate(@RequestBody LoginDTO request) {
        return ResponseEntity.ok(service.login(request.getEmail(), request.getPassword()));
    }
}