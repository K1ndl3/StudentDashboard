package com.ScholarSync.backend.authentication_module.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;


@Data
@RequiredArgsConstructor
public class LoginDTO{
        private String email;
        private String password;
}