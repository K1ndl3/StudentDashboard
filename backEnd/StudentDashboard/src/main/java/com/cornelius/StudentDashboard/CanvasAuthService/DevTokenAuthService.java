package com.cornelius.StudentDashboard.CanvasAuthService;

import com.cornelius.StudentDashboard.Exception.CanvasUnavailableException;
import com.cornelius.StudentDashboard.Exception.InsufficientScopeException;
import com.cornelius.StudentDashboard.Exception.InvalidTokenException;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;

@Service
public class DevTokenAuthService implements CanvasAuthService{
    private final String BASE_URL = "https://csufullerton.instructure.com/api/";
    @Override
    public void validateDevToken(String devToken) {
        String endpoint = "v1/users/self";
        RestTemplate rt = new RestTemplate();
        String url = BASE_URL + endpoint;

        // create the header with the token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(devToken);
        // create the http entity
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        // configure the rest template with headers and url and return value
        try{
            ResponseEntity<String> response = rt.exchange(url, HttpMethod.GET, entity, String.class);
            return;
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new InvalidTokenException();
            }
            if (e.getStatusCode() == HttpStatus.FORBIDDEN) {
                throw new InsufficientScopeException("Under Leveled Privilege");
            }
            throw e;
        } catch (HttpServerErrorException | ResourceAccessException e) {
            throw new CanvasUnavailableException("Canvas in unvailable");
        }
    }
}
