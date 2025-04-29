package com.company.inventory.dto;

import jakarta.persistence.Column;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

public class InventoryResp {
    private UUID id;
    private Integer quantityInStock;
    private LocalDateTime lastRestockDate;
    private UUID productId;
}
