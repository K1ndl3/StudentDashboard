package com.cornelius.StudentDashboard.dto.auth;


public class DevTokenRequest {
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public DevTokenRequest(String token) {
        this.token = token;
    }
}

