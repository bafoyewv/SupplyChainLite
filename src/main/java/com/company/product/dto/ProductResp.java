package com.company.product.dto;

import jakarta.persistence.Column;

import java.math.BigDecimal;
import java.util.UUID;

public class ProductResp {
    private UUID id;
    private String name;
    private BigDecimal price;
    private String description;
    private Integer stockQuantity;
    private UUID supplierId;
}
