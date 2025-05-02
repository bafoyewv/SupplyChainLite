package com.company.inventory;

import com.company.inventory.entity.InventoryMovementHistoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InventoryMovementHistoryRepository extends JpaRepository<InventoryMovementHistoryEntity, UUID> {
    Page<InventoryMovementHistoryEntity> findByInventoryEntityIdAndVisibilityTrue(UUID inventoryId, Pageable pageable);
} 