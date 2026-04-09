package com.ScholarSync.backend.authentication.dto;

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