package com.cornelius.StudentDashboard.service.UserInfoService;

import org.springframework.stereotype.Service;

import com.cornelius.StudentDashboard.CanvasClient.CanvasClient;
import com.cornelius.StudentDashboard.dto.user.UserDto;
@Service
public class UserInfoServiceImpl implements UserInfoService{
    private final CanvasClient client;
    public UserInfoServiceImpl(CanvasClient client) { this.client = client; }
    public UserDto getUserDto(String token) {
        return client.getStudentInfo(token);
    }
}
