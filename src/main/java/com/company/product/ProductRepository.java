package com.company.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<ProductEntity, UUID> {
    Optional<ProductEntity> findByName(String name);
    Optional<ProductEntity> findByIdAndVisibilityTrue(UUID id);

    @Query("SELECT p FROM ProductEntity p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) AND p.visibility = true")
    Page<ProductEntity> searchProducts(@Param("name") String name, Pageable pageable);

    Page<ProductEntity> findByStockQuantityLessThanEqualAndVisibilityTrue(int threshold, Pageable pageable);

    Page<ProductEntity> findBySupplierIdAndVisibilityTrue(UUID supplierId, Pageable pageable);
}
