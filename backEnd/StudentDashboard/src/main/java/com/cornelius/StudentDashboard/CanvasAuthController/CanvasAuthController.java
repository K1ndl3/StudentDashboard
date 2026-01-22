    package com.cornelius.StudentDashboard.CanvasAuthController;

    import com.cornelius.StudentDashboard.CanvasAuthService.CanvasAuthService;
    import com.cornelius.StudentDashboard.Exception.CanvasUnavailableException;
    import com.cornelius.StudentDashboard.Exception.InsufficientScopeException;
    import com.cornelius.StudentDashboard.Exception.InvalidTokenException;
    import com.cornelius.StudentDashboard.dto.auth.DevTokenRequest;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestBody;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    @RequestMapping("/auth")
    public class CanvasAuthController {
        private CanvasAuthService authService;
        public CanvasAuthController(CanvasAuthService service) {
            this.authService = service;
        }

        @PostMapping("/dev-token")
        public ResponseEntity<Void> validateDevToken(@RequestBody DevTokenRequest dto) {
            String token = dto.getToken();
            try {
                authService.validateDevToken(token);
                return ResponseEntity.noContent().build();
            } catch (InvalidTokenException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            } catch (InsufficientScopeException e) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            } catch (CanvasUnavailableException e) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
            }

        }


    }
