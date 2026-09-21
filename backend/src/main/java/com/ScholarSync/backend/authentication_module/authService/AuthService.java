package com.ScholarSync.backend.authentication_module.authService;

import com.ScholarSync.backend.authentication_module.dto.RegistrationDTO;
import com.ScholarSync.backend.authentication_module.dto.TokenDTO;
import com.ScholarSync.backend.model_module.user.User;
import com.ScholarSync.backend.model_module.user.UserDetailRepo;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final PasswordEncoder encoder;
    private final UserDetailRepo repo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            PasswordEncoder encoder,
            UserDetailRepo repo,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.encoder = encoder;
        this.repo = repo;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public TokenDTO login(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        var user = repo.findByEmail(email).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        
        return TokenDTO.builder().token(jwtToken).build();
    }

    public TokenDTO register(RegistrationDTO request) {
        if (repo.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        if (repo.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        var user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));

        try {
            repo.save(user);
        } catch (DataIntegrityViolationException exception) {
            // Protect against two registration requests passing the checks concurrently.
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username or email already exists",
                    exception
            );
        }
        
        var jwtToken = jwtService.generateToken(user);
        
        return TokenDTO.builder().token(jwtToken).build();
    }
}