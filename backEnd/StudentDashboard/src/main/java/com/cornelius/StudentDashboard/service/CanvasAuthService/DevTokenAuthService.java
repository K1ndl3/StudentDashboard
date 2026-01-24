package com.cornelius.StudentDashboard.service.CanvasAuthService;

import com.cornelius.StudentDashboard.CanvasClient.CanvasClient;
import org.springframework.stereotype.Service;

@Service
public class DevTokenAuthService implements CanvasAuthService{
    private final CanvasClient client;
    public DevTokenAuthService(CanvasClient client) { this.client = client; }
    @Override
    public void validateDevToken(String devToken) {
        client.ValidateDevToken(devToken);
    }
}
