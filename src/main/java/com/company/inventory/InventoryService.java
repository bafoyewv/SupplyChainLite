package com.company.inventory;

import com.company.exception.AppBadRequestException;
import com.company.exception.ItemNotFoundException;
import com.company.inventory.dto.InventoryCr;
import com.company.inventory.dto.InventoryMovementHistoryResp;
import com.company.inventory.dto.InventoryResp;
import com.company.inventory.entity.InventoryEntity;
import com.company.inventory.entity.InventoryMovementHistoryEntity;
import com.company.product.ProductEntity;
import com.company.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final InventoryMovementHistoryRepository inventoryMovementHistoryRepository;

    public ResponseEntity<InventoryResp> create(InventoryCr inventoryCr) {
        ProductEntity productEntity = productRepository.findById(inventoryCr.getProductId())
                .orElseThrow(() -> new AppBadRequestException("Product not found"));

        InventoryEntity inventoryEntity = InventoryEntity.builder()
                .quantityInStock(inventoryCr.getQuantityInStock())
                .productEntity(productEntity)
                .visibility(true)
                .build();

        InventoryEntity saved = inventoryRepository.save(inventoryEntity);
        return ResponseEntity.ok(toDTO(saved));
    }

    public ResponseEntity<InventoryResp> getById(UUID id) {
        InventoryEntity inventoryEntity = getInventoryById(id);
        return ResponseEntity.ok(toDTO(inventoryEntity));
    }

    public ResponseEntity<Page<InventoryResp>> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
        List<InventoryResp> list = inventoryRepository.findAll(pageable)
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(new PageImpl<>(list, pageable, list.size()));
    }

    public ResponseEntity<InventoryResp> update(UUID id, InventoryCr inventoryCr) {
        InventoryEntity inventoryEntity = getInventoryById(id);
        ProductEntity productEntity = productRepository.findById(inventoryCr.getProductId())
                .orElseThrow(() -> new AppBadRequestException("Product not found"));

        inventoryEntity.setQuantityInStock(inventoryCr.getQuantityInStock());
        inventoryEntity.setProductEntity(productEntity);

        InventoryEntity saved = inventoryRepository.save(inventoryEntity);
        return ResponseEntity.ok(toDTO(saved));
    }

    public ResponseEntity<String> delete(UUID id) {
        InventoryEntity inventoryEntity = getInventoryById(id);
        inventoryEntity.setVisibility(false);
        inventoryRepository.save(inventoryEntity);
        return ResponseEntity.ok("Inventory Deleted Successfully");
    }

    public ResponseEntity<Page<InventoryResp>> getInventoryAlerts(
            @RequestParam(defaultValue = "10") int threshold,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("quantityInStock"));
        List<InventoryResp> list = inventoryRepository.findByQuantityInStockLessThanEqualAndVisibilityTrue(threshold, pageable)
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(new PageImpl<>(list, pageable, list.size()));
    }

    public ResponseEntity<Page<InventoryMovementHistoryResp>> getInventoryMovementHistory(
            @PathVariable UUID inventoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        List<InventoryMovementHistoryResp> list = inventoryMovementHistoryRepository
                .findByInventoryEntityIdAndVisibilityTrue(inventoryId, pageable)
                .stream()
                .map(this::toMovementHistoryDTO)
                .toList();
        return ResponseEntity.ok(new PageImpl<>(list, pageable, list.size()));
    }

    public ResponseEntity<InventoryResp> updateInventoryQuantity(
            @PathVariable UUID id,
            @RequestParam int newQuantity,
            @RequestParam String movementType
    ) {
        InventoryEntity inventoryEntity = getInventoryById(id);
        
        // Save movement history
        InventoryMovementHistoryEntity movementHistory = InventoryMovementHistoryEntity.builder()
                .inventoryEntity(inventoryEntity)
                .previousQuantity(inventoryEntity.getQuantityInStock())
                .newQuantity(newQuantity)
                .movementType(movementType)
                .createdAt(LocalDateTime.now())
                .visibility(true)
                .build();
        inventoryMovementHistoryRepository.save(movementHistory);

        // Update inventory quantity
        inventoryEntity.setQuantityInStock(newQuantity);
        inventoryEntity.setLastRestockDate(LocalDateTime.now());
        InventoryEntity saved = inventoryRepository.save(inventoryEntity);

        return ResponseEntity.ok(toDTO(saved));
    }

    private InventoryResp toDTO(InventoryEntity inventoryEntity) {
        return InventoryResp.builder()
                .id(inventoryEntity.getId())
                .quantityInStock(inventoryEntity.getQuantityInStock())
                .lastRestockDate(inventoryEntity.getLastRestockDate())
                .productId(inventoryEntity.getProductId())
                .build();
    }

    private InventoryEntity getInventoryById(UUID id) {
        return inventoryRepository.findByIdAndVisibilityTrue(id)
                .orElseThrow(ItemNotFoundException::new);
    }

    private InventoryMovementHistoryResp toMovementHistoryDTO(InventoryMovementHistoryEntity entity) {
        return InventoryMovementHistoryResp.builder()
                .id(entity.getId())
                .inventoryId(entity.getInventoryEntity().getId())
                .previousQuantity(entity.getPreviousQuantity())
                .newQuantity(entity.getNewQuantity())
                .movementType(entity.getMovementType())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
