package com.company.orderdetails;

import com.company.orderdetails.dto.OrderDetailsCr;
import com.company.orderdetails.dto.OrderDetailsResp;
import com.company.orderdetails.dto.OrderSummaryDTO;
import com.company.orders.OrdersEntity;
import com.company.orders.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/order-details")
@RequiredArgsConstructor
public class OrderDetailsController {
    private final OrderDetailsService orderDetailsService;

    @PostMapping
    public ResponseEntity<OrderDetailsResp> create(@RequestBody OrderDetailsCr orderDetailsCr) {
        return orderDetailsService.create(orderDetailsCr);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailsResp> getById(@PathVariable UUID id) {
        return orderDetailsService.getById(id);
    }

    @GetMapping
    public ResponseEntity<Page<OrderDetailsResp>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return orderDetailsService.getAll(page, size);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDetailsResp> update(
            @PathVariable UUID id,
            @RequestBody OrderDetailsCr orderDetailsCr
    ) {
        return orderDetailsService.update(id, orderDetailsCr);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        return orderDetailsService.delete(id);
    }
    
    /**
     * Get all pending orders
     */
    @GetMapping("/pending")
    public ResponseEntity<List<OrdersEntity>> getPendingOrders() {
        return ResponseEntity.ok(orderDetailsService.getPendingOrders());
    }
    
    /**
     * Update the status of an order
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrdersEntity> updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(orderDetailsService.updateOrderStatus(orderId, status));
    }
    
    /**
     * Cancel an order
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable UUID orderId) {
        orderDetailsService.cancelOrder(orderId);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Get all orders for a specific customer
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrdersEntity>> getOrdersByCustomerId(@PathVariable UUID customerId) {
        return ResponseEntity.ok(orderDetailsService.getOrdersByCustomerId(customerId));
    }
    
    /**
     * Calculate the total price of an order
     */
    @GetMapping("/{orderId}/total")
    public ResponseEntity<BigDecimal> calculateTotalOrderPrice(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderDetailsService.calculateTotalOrderPrice(orderId));
    }
    
    /**
     * Get order summary within a date range
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<LocalDate, List<OrdersEntity>>> getOrderSummaryByDateRange(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to
    ) {
        return ResponseEntity.ok(orderDetailsService.getOrderSummaryByDateRange(from, to));
    }
}
