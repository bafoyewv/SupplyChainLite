package com.company.orderDetails;

import com.company.orderDetails.dto.OrderDetailsCr;
import com.company.orderDetails.dto.OrderDetailsResp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<OrderDetailsResp> update(@PathVariable UUID id, @RequestBody OrderDetailsCr orderDetailsCr) {
        return orderDetailsService.update(id, orderDetailsCr);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        return orderDetailsService.delete(id);
    }
}
