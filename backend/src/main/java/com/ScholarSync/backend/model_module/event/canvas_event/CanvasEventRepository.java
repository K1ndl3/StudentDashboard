package com.ScholarSync.backend.model_module.event.canvas_event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CanvasEventRepository extends JpaRepository<CanvasEvent,Long>{
    
}
