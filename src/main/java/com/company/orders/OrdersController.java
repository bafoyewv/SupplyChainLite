package com.company.orders;

import com.company.orders.dto.OrdersCr;
import com.company.orders.dto.OrdersResp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/order")
@RequiredArgsConstructor
public class OrdersController {
    private final OrdersService ordersService;

    @PostMapping
    public ResponseEntity<OrdersResp> create(@RequestBody OrdersCr ordersCr) {
        return ordersService.create(ordersCr);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdersResp> getById(@PathVariable UUID id) {
        return ordersService.getById(id);
    }

    @GetMapping
    public ResponseEntity<Page<OrdersResp>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ordersService.getAll(page, size);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdersResp> update(@PathVariable UUID id, @RequestBody OrdersCr ordersCr) {
        return ordersService.update(id, ordersCr);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        return ordersService.delete(id);
    }

    @GetMapping("/get-orders-by-status/{status}")
    public ResponseEntity<Page<OrdersResp>> getOrdersByStatus(
            @PathVariable Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ordersService.getOrdersByStatus(status, page, size);
    }

    @GetMapping("/get-orders-by-date-range/{startDate}/{endDate}")
    public ResponseEntity<Page<OrdersResp>> getOrdersByDateRange(
            @PathVariable LocalDate startDate,
            @PathVariable LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ordersService.getOrdersByDateRange(startDate, endDate, page, size);
    }
} 