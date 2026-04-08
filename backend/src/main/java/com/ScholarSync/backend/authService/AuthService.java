package com.ScholarSync.backend.authService;

import com.ScholarSync.backend.dto.RegistrationDTO;
import com.ScholarSync.backend.dto.TokenDTO;
import com.ScholarSync.backend.user.User;
import com.ScholarSync.backend.user.UserDetailRepo;
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

    // Spring Boot 3 will automatically inject all 4 of these beans
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

    public String login(String username, String password) {
        // This line triggers the entire Spring Security check (Database lookup + Password match)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        // If we reach this line, authentication was successful
        var user = repo.findByUsername(username).orElseThrow();
        return jwtService.generateToken(user);
    }

    public TokenDTO register(RegistrationDTO request) {
        var user = new User();
        user.setUsername(request.username());

        // --- THIS IS THE MISSING LINE ---
        user.setEmail(request.email());
        // --------------------------------

        user.setPassword(encoder.encode(request.password()));

        repo.save(user); // Hibernate will be happy now!

        var jwtToken = jwtService.generateToken(user);
        return new TokenDTO(jwtToken);
    }
}