package com.company.supplier;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SupplierRepository extends JpaRepository<SupplierEntity, UUID> {

    Optional<SupplierEntity> findByName(String name);

    Optional<SupplierEntity> findByIdAndVisibilityTrue(UUID id);
}
