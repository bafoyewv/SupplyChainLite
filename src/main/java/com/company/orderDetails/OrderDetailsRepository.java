package com.company.orderDetails;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OrderDetailsRepository extends JpaRepository<OrderDetailsEntity, UUID> {
    Optional<OrderDetailsEntity> findByIdAndVisibilityTrue(UUID id);
}
