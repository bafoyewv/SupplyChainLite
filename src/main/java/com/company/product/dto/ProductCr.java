package com.company.product.dto;

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
public class ProductCr {
    private String name;
    private BigDecimal price;
    private String description;
    private Integer stockQuantity;
    private UUID supplierId;
    private String category;
}
