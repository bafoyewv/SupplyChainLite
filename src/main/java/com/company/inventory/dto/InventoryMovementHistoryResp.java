package com.company.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryMovementHistoryResp {
    private UUID id;
    private UUID inventoryId;
    private int previousQuantity;
    private int newQuantity;
    private String movementType;
    private LocalDateTime createdAt;
} 