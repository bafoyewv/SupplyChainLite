package com.company.product.dto;

import jakarta.persistence.Column;

import java.math.BigDecimal;

public class ProductCr {
    private String name;
    private BigDecimal price;
    private String description;
    private Integer stockQuantity;
}
