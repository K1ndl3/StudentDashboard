package com.ScholarSync.backend.authentication_module.authService;

import com.ScholarSync.backend.authentication_module.dto.RegistrationDTO;
import com.ScholarSync.backend.authentication_module.dto.TokenDTO;
import com.ScholarSync.backend.model_module.user.User;
import com.ScholarSync.backend.model_module.user.UserDetailRepo;

import ch.qos.logback.core.subst.Token;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

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
        var user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        
        repo.save(user);
        
        var jwtToken = jwtService.generateToken(user);
        
        return TokenDTO.builder().token(jwtToken).build();
    }
}