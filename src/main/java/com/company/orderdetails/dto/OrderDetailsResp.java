package com.company.orderdetails.dto;

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
public class OrderDetailsResp {
    private UUID id;
    private Integer quantity;
    private BigDecimal price;
    private UUID orderId;
    private UUID productId;
}
