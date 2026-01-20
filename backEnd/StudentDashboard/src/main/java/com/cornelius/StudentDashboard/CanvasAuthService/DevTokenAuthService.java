package com.cornelius.StudentDashboard.CanvasAuthService;

import com.cornelius.StudentDashboard.CanvasClient.CanvasClient;
import com.cornelius.StudentDashboard.Exception.CanvasUnavailableException;
import com.cornelius.StudentDashboard.Exception.InsufficientScopeException;
import com.cornelius.StudentDashboard.Exception.InvalidTokenException;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;

import java.awt.*;

@Service
public class DevTokenAuthService implements CanvasAuthService{
    private CanvasClient client;
    public DevTokenAuthService(CanvasClient client) { this.client = client; }
    @Override
    public void validateDevToken(String devToken) {
        client.ValidateDevToken(devToken);
    }
}
