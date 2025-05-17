package com.company.inventory;

import com.company.inventory.entity.InventoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InventoryRepository extends JpaRepository<InventoryEntity, UUID> {
    Optional<InventoryEntity> findByIdAndVisibilityTrue(UUID id);
    
    Page<InventoryEntity> findByQuantityInStockLessThanEqualAndVisibilityTrue(int threshold, Pageable pageable);
    
    Page<InventoryEntity> findAllByVisibilityTrue(Pageable pageable);

    Page<InventoryEntity> findByProductEntityCategoryAndVisibilityTrue(String category, Pageable pageable);
    
    Optional<InventoryEntity> findByProductIdAndVisibilityTrue(UUID productId);
    
    @Query("SELECT i FROM InventoryEntity i LEFT JOIN InventoryMovementHistoryEntity h ON i.id = h.inventoryEntity.id " +
           "WHERE i.visibility = true GROUP BY i.id ORDER BY COUNT(h.id) DESC")
    List<InventoryEntity> findTopMovingItems(Pageable pageable);
    
    @Query("SELECT i FROM InventoryEntity i LEFT JOIN InventoryMovementHistoryEntity h ON i.id = h.inventoryEntity.id " +
           "WHERE i.visibility = true AND (h.createdAt IS NULL OR h.createdAt < :cutoffDate) " +
           "GROUP BY i.id HAVING MAX(h.createdAt) < :cutoffDate OR MAX(h.createdAt) IS NULL")
    List<InventoryEntity> findInactiveItems(@Param("cutoffDate") LocalDateTime cutoffDate, Pageable pageable);
}
