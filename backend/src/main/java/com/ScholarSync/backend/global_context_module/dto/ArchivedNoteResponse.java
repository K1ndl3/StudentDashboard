package com.ScholarSync.backend.global_context_module.dto;

import java.time.Instant;
import java.time.LocalDate;

import com.ScholarSync.backend.model_module.user.ArchivedNote;

public record ArchivedNoteResponse(
    Long id,
    String title,
    String content,
    LocalDate date,
    Instant updatedAt
) {
    public static ArchivedNoteResponse from(ArchivedNote note) {
        return new ArchivedNoteResponse(
            note.getId(),
            note.getTitle(),
            note.getContent(),
            note.getDate(),
            note.getUpdatedAt()
        );
    }
}
