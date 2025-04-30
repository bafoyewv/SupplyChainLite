package com.company.inventory;

import com.company.exception.AppBadRequestException;
import com.company.exception.ItemNotFoundException;
import com.company.inventory.dto.InventoryCr;
import com.company.inventory.dto.InventoryResp;
import com.company.product.ProductEntity;
import com.company.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

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
}
