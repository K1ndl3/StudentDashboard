package com.ScholarSync.backend.model_module.event.task_event;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTaskRepository extends JpaRepository<UserTask,Long>{
    Optional<UserTask> findByIdAndUserEmail(Long id, String email);
}
