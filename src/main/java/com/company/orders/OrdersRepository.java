package com.company.orders;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OrdersRepository extends JpaRepository<OrdersEntity, UUID> {
    Optional<OrdersEntity> findByIdAndVisibilityTrue(UUID id);
} 