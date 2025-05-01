package com.company.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<ProductEntity, UUID> {
    Optional<ProductEntity> findByName(String name);
    Optional<ProductEntity> findByIdAndVisibilityTrue(UUID id);

    Page<ProductEntity> findByNameContainingIgnoreCaseAndVisibilityTrue(String name, Pageable pageable);

    Page<ProductEntity> findByStockQuantityLessThanEqualAndVisibilityTrue(int threshold, Pageable pageable);

    Page<ProductEntity> findBySupplierIdAndVisibilityTrue(UUID supplierId, Pageable pageable);
}
