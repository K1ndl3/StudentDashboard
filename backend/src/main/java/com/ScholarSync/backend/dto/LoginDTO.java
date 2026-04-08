package com.ScholarSync.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO (
        @NotBlank(message = "username cannot be blank")
        String username,
        @NotBlank(message = "password cannot be blank")
        String password
){}