package com.company.inventory;

import com.company.inventory.entity.InventoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public interface InventoryRepository extends JpaRepository<InventoryEntity, UUID> {
    Optional<InventoryEntity> findByIdAndVisibilityTrue(UUID id);
    
    Page<InventoryEntity> findByQuantityInStockLessThanEqualAndVisibilityTrue(int threshold, Pageable pageable);
    
    Page<InventoryEntity> findAllByVisibilityTrue(Pageable pageable);

    Page<InventoryEntity> findByProductEntityCategoryAndVisibilityTrue(String category, Pageable pageable);
}
