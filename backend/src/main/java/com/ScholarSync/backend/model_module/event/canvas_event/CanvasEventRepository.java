package com.ScholarSync.backend.model_module.event.canvas_event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CanvasEventRepository extends JpaRepository<CanvasEvent,Long>{
    Optional<CanvasEvent> findByIdAndUserId(Long id, long userId);

    List<CanvasEvent> findAllByUserId(long userId);

    void deleteAllByUserId(long userId);
}
