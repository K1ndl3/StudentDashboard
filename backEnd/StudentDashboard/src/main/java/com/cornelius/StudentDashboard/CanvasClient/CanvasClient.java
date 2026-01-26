package com.cornelius.StudentDashboard.CanvasClient;

import com.cornelius.StudentDashboard.Exception.CanvasUnavailableException;
import com.cornelius.StudentDashboard.Exception.InsufficientScopeException;
import com.cornelius.StudentDashboard.Exception.InvalidTokenException;
import com.cornelius.StudentDashboard.dto.course.CourseDTO;
import com.cornelius.StudentDashboard.dto.user.UserDto;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Component
public class CanvasClient {
    final private String BASE_URL_CSUF = "https://csufullerton.instructure.com/api/";

    public void ValidateDevToken(String token) {
        String endpoint = "v1/users/self";
        String url = BASE_URL_CSUF + endpoint;

        HttpHeaders header = new HttpHeaders();
        header.setBearerAuth(token);
        RestTemplate rt = new RestTemplate();
        HttpEntity<Void> entity = new HttpEntity<>(header);

        try {
            ResponseEntity<String> response = rt.exchange(url, HttpMethod.GET, entity, String.class);
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
    public UserDto getStudentInfo(String token) {
        String endpoint = "v1/users/self";
        String url = BASE_URL_CSUF + endpoint;

        HttpHeaders header = new HttpHeaders();
        header.setBearerAuth(token);
        HttpEntity<Void> entity = new HttpEntity<>(header);

        RestTemplate rt = new RestTemplate();
        try {
            ResponseEntity<UserDto> response = rt.exchange(url, HttpMethod.GET, entity, UserDto.class);
            return response.getBody();
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

    public CourseDTO getCourseInfo(String token) {
        String endpoint = "/api/v1/courses?enrollment_state&include[]=total_scores";
        String url = BASE_URL_CSUF + endpoint;
        HttpHeaders header = new HttpHeaders();
        header.setBearerAuth(token);
        HttpEntity<Void> entity = new HttpEntity<>(header);

        RestTemplate rt = new RestTemplate();
        try {
            ResponseEntity<CourseDTO> response = rt.exchange(url, HttpMethod.GET, entity, CourseDTO.class);
            return response.getBody();
        }  catch (HttpClientErrorException e) {
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
