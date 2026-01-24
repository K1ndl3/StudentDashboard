package com.cornelius.StudentDashboard.controller.CanvasUserController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cornelius.StudentDashboard.dto.user.UserDto;
import com.cornelius.StudentDashboard.service.UserInfoService.UserInfoService;
import com.cornelius.StudentDashboard.Exception.CanvasUnavailableException;
import com.cornelius.StudentDashboard.Exception.InsufficientScopeException;
import com.cornelius.StudentDashboard.Exception.InvalidTokenException;
import com.cornelius.StudentDashboard.dto.auth.DevTokenRequest;
@RestController
public class CanvasUserController {
    private final UserInfoService service;
    CanvasUserController(UserInfoService service) { this.service = service;}

    @PostMapping("/user")
    public ResponseEntity<UserDto> getUser(@RequestBody DevTokenRequest dto) {
        String token = dto.getToken();
        try {
            UserDto user = service.getUserDto(token);
            return ResponseEntity.ok(user);
        } catch (InvalidTokenException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            } catch (InsufficientScopeException e) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            } catch (CanvasUnavailableException e) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
            }
    }
}
