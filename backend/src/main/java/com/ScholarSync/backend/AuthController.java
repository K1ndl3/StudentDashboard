package com.ScholarSync.backend;

import com.ScholarSync.backend.authService.AuthService;
import com.ScholarSync.backend.dto.LoginDTO;
import com.ScholarSync.backend.dto.RegistrationDTO;
import com.ScholarSync.backend.dto.TokenDTO;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<TokenDTO> authenticate(
            @Valid
            @RequestBody LoginDTO request) {
        String token = service.login(request.username(), request.password());
        return ResponseEntity.ok(new TokenDTO(token));
    }
}