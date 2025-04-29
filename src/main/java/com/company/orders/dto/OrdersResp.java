package com.company.orders.dto;

import com.company.orders.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrdersResp {
    private UUID orderId;
    private LocalDateTime orderDate;
    private Status status;
}
