package com.cornelius.StudentDashboard.service.UserInfoService;

import com.cornelius.StudentDashboard.dto.user.UserDto;

public interface UserInfoService {
   public UserDto getUserDto(String token);
}
