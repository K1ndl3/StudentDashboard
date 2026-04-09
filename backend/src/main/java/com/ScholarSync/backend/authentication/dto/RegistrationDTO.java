package com.ScholarSync.backend.authentication.dto;


import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class RegistrationDTO{

        private String username;
        private String password;
        private String email;
}
