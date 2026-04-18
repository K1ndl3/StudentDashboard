package com.ScholarSync.backend.global_context_module.service;

import java.lang.foreign.Linker.Option;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ScholarSync.backend.global_context_module.dto.GlobalContextDTO;
import com.ScholarSync.backend.model_module.event.canvas_event.CanvasEventRepository;
import com.ScholarSync.backend.model_module.user.User;
import com.ScholarSync.backend.model_module.user.UserDetailRepo;

import jakarta.transaction.Transactional;

@Service
public class GlobalContextService {

    private UserDetailRepo userRepository;

    public GlobalContextService(UserDetailRepo userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public GlobalContextDTO getGlobalContextDTO(String currUserEmail) {
        Optional<User> user = userRepository.findByEmail(currUserEmail);
        if (user.isEmpty()) {
            throw new RuntimeException("user not found");
        }
        return new GlobalContextDTO(
            // returns the user's name not email this method is found the user model
            user.get().getDisplayName(),
            user.get().getCanvasEvent()
        );
    }


}
