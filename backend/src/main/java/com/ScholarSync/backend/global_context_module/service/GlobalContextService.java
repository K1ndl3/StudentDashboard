package com.ScholarSync.backend.global_context_module.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ScholarSync.backend.global_context_module.dto.GlobalContextDTO;
import com.ScholarSync.backend.model_module.event.task_event.UserTask;
import com.ScholarSync.backend.model_module.event.task_event.UserTaskRepository;
import com.ScholarSync.backend.model_module.user.NotepadRepository;
import com.ScholarSync.backend.model_module.user.User;
import com.ScholarSync.backend.model_module.user.UserDetailRepo;

import jakarta.transaction.Transactional;

@Service
public class GlobalContextService {

    private UserDetailRepo userRepository;
    private UserTaskRepository userTaskRepository;
    private NotepadRepository notepadRepository;

    public GlobalContextService(
        UserDetailRepo userRepository,
        UserTaskRepository userTaskRepository,
        NotepadRepository notepadRepository
    ) {
        this.userRepository = userRepository;
        this.userTaskRepository = userTaskRepository;
        this.notepadRepository = notepadRepository;
    }
    // this returns the user information globally 
    @Transactional
    public GlobalContextDTO getGlobalContextDTO(String currUserEmail) {
        Optional<User> user = userRepository.findByEmail(currUserEmail);
        if (user.isEmpty()) {
            throw new RuntimeException("user not found");
        }
        return new GlobalContextDTO(
            // returns the user's name not email this method is found the user model
            user.get().getDisplayName(),
            user.get().getCanvasEvent(),
            user.get().getUserTask(),
            user.get().getNotepad()
        );
    }

    // Reconcile the complete guest-style task list for this user.
    @Transactional
    public String saveUserTasks(String currUserEmail, List<UserTask> tasks) {
        Optional<User> user = userRepository.findByEmail(currUserEmail);
        if (user.isEmpty()) {
            throw new RuntimeException("user not found");
        }

        List<UserTask> safeTasks = tasks == null ? List.of() : tasks;
        Set<Long> incomingIds = safeTasks.stream()
            .map(UserTask::getId)
            .collect(Collectors.toSet());

        List<UserTask> existingTasks = userTaskRepository.findAllByUserEmail(currUserEmail);
        Set<Long> existingIds = existingTasks.stream()
            .map(UserTask::getId)
            .collect(Collectors.toSet());

        boolean containsForeignTask = incomingIds.stream()
            .anyMatch(id -> !existingIds.contains(id) && userTaskRepository.existsById(id));
        if (containsForeignTask) {
            throw new IllegalArgumentException("cannot update another user's task");
        }

        userTaskRepository.deleteAll(
            existingTasks.stream()
                .filter(task -> !incomingIds.contains(task.getId()))
                .toList()
        );
        safeTasks.forEach(task -> task.setUser(user.get()));
        userTaskRepository.saveAll(safeTasks);
        return "Saved " + safeTasks.size() + " tasks to database";
    }

    @Transactional
    public String deleteUserTask(String currUserEmail, Long taskId) {
        Optional<UserTask> userTask = userTaskRepository.findByIdAndUserEmail(taskId, currUserEmail);
        if (userTask.isEmpty()) {
            throw new RuntimeException("task not found for user");
        }

        userTaskRepository.delete(userTask.get());
        return "Deleted task with id " + taskId;
    }

    @Transactional
    public String saveUserNotepad(String currUserEmail, String notepad) {
        Optional<User> user = notepadRepository.findByEmail(currUserEmail);
        if (user.isEmpty()) {
            throw new RuntimeException("user not found");
        }

        String trimmedNotepad = notepad == null ? "" : notepad;
        if (trimmedNotepad.length() > 10000) {
            throw new IllegalArgumentException("notepad cannot exceed 10000 characters");
        }

        User currentUser = user.get();
        currentUser.setNotepad(trimmedNotepad);
        notepadRepository.save(currentUser);
        return "Notepad saved successfully";
    }
}
