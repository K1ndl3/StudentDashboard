package com.ScholarSync.backend.model_module.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotepadRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
