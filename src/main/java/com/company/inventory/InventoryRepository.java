package com.company.inventory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
public interface InventoryRepository extends JpaRepository<InventoryEntity, UUID> {
}
