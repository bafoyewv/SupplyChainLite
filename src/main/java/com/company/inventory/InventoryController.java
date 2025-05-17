package com.company.inventory;

import com.company.inventory.dto.InventoryCr;
import com.company.inventory.dto.InventoryMovementHistoryResp;
import com.company.inventory.dto.InventoryResp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.service.annotation.PutExchange;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<InventoryResp> create(@RequestBody InventoryCr inventoryCr) {
        return inventoryService.create(inventoryCr);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryResp> getById(@PathVariable UUID id) {
        return inventoryService.getById(id);
    }

    @GetMapping
    public ResponseEntity<Page<InventoryResp>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return inventoryService.getAll(page, size);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryResp> update(
            @PathVariable UUID id,
            @RequestBody InventoryCr inventoryCr
    ) {
        return inventoryService.update(id, inventoryCr);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        return inventoryService.delete(id);
    }

    @GetMapping("/alerts")
    public ResponseEntity<Page<InventoryResp>> getInventoryAlerts(
            @RequestParam(defaultValue = "10") int threshold,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return inventoryService.getInventoryAlerts(threshold, page, size);
    }

    @GetMapping("/{inventoryId}/movement-history")
    public ResponseEntity<Page<InventoryMovementHistoryResp>> getInventoryMovementHistory(
            @PathVariable UUID inventoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return inventoryService.getInventoryMovementHistory(inventoryId, page, size);
    }

    @PutMapping("/{id}/quantity")
    public ResponseEntity<InventoryResp> updateInventoryQuantity(
            @PathVariable UUID id,
            @RequestParam int newQuantity,
            @RequestParam String movementType
    ) {
        return inventoryService.updateInventoryQuantity(id, newQuantity, movementType);
    }


    @GetMapping("/low-stock")
    public ResponseEntity<Page<InventoryResp>> getLowStockItems(@RequestParam(defaultValue = "10") int threshold) {
        return inventoryService.getLowStockItems(threshold);
    }

    @GetMapping("/by-category/{category}")
    public ResponseEntity<Page<InventoryResp>> getInventoryByCategory(@PathVariable String category) {
        return inventoryService.getInvetoryByCategory(category);
    }
    

}
