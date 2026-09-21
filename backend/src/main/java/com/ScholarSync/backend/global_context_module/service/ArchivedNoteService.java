package com.ScholarSync.backend.global_context_module.service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ScholarSync.backend.global_context_module.dto.ArchivedNoteRequest;
import com.ScholarSync.backend.global_context_module.dto.ArchivedNoteResponse;
import com.ScholarSync.backend.model_module.user.ArchivedNote;
import com.ScholarSync.backend.model_module.user.ArchivedNoteRepository;
import com.ScholarSync.backend.model_module.user.User;
import com.ScholarSync.backend.model_module.user.UserDetailRepo;

import jakarta.transaction.Transactional;

@Service
public class ArchivedNoteService {
    private static final int MAX_TITLE_LENGTH = 100;
    private static final int MAX_CONTENT_LENGTH = 10000;

    private final ArchivedNoteRepository archivedNoteRepository;
    private final UserDetailRepo userRepository;

    public ArchivedNoteService(
        ArchivedNoteRepository archivedNoteRepository,
        UserDetailRepo userRepository
    ) {
        this.archivedNoteRepository = archivedNoteRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<ArchivedNoteResponse> findAll(String email) {
        return archivedNoteRepository.findAllByUserEmailOrderByUpdatedAtDesc(email)
            .stream()
            .map(ArchivedNoteResponse::from)
            .toList();
    }

    @Transactional
    public ArchivedNoteResponse create(String email, ArchivedNoteRequest request) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("user not found"));

        ArchivedNote note = new ArchivedNote();
        applyRequest(note, request);
        note.setDate(LocalDate.now());
        note.setUpdatedAt(Instant.now());
        note.setUser(user);
        return ArchivedNoteResponse.from(archivedNoteRepository.save(note));
    }

    @Transactional
    public ArchivedNoteResponse update(String email, Long id, ArchivedNoteRequest request) {
        ArchivedNote note = archivedNoteRepository.findByIdAndUserEmail(id, email)
            .orElseThrow(() -> new RuntimeException("archived note not found"));

        applyRequest(note, request);
        note.setUpdatedAt(Instant.now());
        return ArchivedNoteResponse.from(archivedNoteRepository.save(note));
    }

    @Transactional
    public void delete(String email, Long id) {
        ArchivedNote note = archivedNoteRepository.findByIdAndUserEmail(id, email)
            .orElseThrow(() -> new RuntimeException("archived note not found"));
        archivedNoteRepository.delete(note);
    }

    private void applyRequest(ArchivedNote note, ArchivedNoteRequest request) {
        if (request == null || request.title() == null || request.title().trim().isEmpty()) {
            throw new IllegalArgumentException("title is required");
        }

        String title = request.title().trim();
        String content = request.content() == null ? "" : request.content();
        if (title.length() > MAX_TITLE_LENGTH) {
            throw new IllegalArgumentException("title cannot exceed 100 characters");
        }
        if (content.length() > MAX_CONTENT_LENGTH) {
            throw new IllegalArgumentException("note cannot exceed 10000 characters");
        }

        note.setTitle(title);
        note.setContent(content);
    }
}
