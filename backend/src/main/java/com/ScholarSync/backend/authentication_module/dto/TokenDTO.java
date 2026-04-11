package com.ScholarSync.backend.authentication_module.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class TokenDTO {
        private String token; 
}