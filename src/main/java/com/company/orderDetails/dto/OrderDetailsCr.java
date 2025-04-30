package com.company.orderDetails.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailsCr {
    private Integer quantity;
    private BigDecimal price;
    private UUID orderId;
    private UUID productId;
}
