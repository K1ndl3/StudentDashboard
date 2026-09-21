package com.ScholarSync.backend.authentication_module.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistrationDTO{

        @NotBlank
        private String username;

        @NotBlank
        @Size(min = 8)
        private String password;

        @NotBlank
        @Email
        private String email;
}
