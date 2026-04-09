package com.ScholarSync.backend.authentication.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;


@Data
@RequiredArgsConstructor
public class LoginDTO{
        private String email;
        private String password;
}