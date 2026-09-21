package com.ScholarSync.backend.model_module.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchivedNoteRepository extends JpaRepository<ArchivedNote, Long> {
    List<ArchivedNote> findAllByUserEmailOrderByUpdatedAtDesc(String email);

    Optional<ArchivedNote> findByIdAndUserEmail(Long id, String email);
}
