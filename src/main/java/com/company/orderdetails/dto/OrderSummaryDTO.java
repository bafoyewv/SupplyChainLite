package com.company.orderdetails.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryDTO {
    private LocalDate fromDate;
    private LocalDate toDate;
    private int totalOrders;
    private BigDecimal totalRevenue;
    private int totalItemsSold;
} 