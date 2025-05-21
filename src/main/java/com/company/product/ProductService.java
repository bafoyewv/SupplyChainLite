package com.company.product;

import com.company.exception.AppBadRequestException;
import com.company.exception.ItemNotFoundException;
import com.company.product.dto.ProductCr;
import com.company.product.dto.ProductResp;
import com.company.supplier.SupplierEntity;
import com.company.supplier.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public ResponseEntity<ProductResp> create(ProductCr productCr) {
        Optional<ProductEntity> optionalProduct = productRepository.findByName(productCr.getName());
        if (optionalProduct.isPresent()) {
            throw new AppBadRequestException("Product already exists");
        }

        SupplierEntity supplierEntity = supplierRepository.findById(productCr.getSupplierId())
                .orElseThrow(() -> new AppBadRequestException("Supplier not found"));

        ProductEntity productEntity = ProductEntity.builder()
                .name(productCr.getName())
                .price(productCr.getPrice())
                .description(productCr.getDescription())
                .stockQuantity(productCr.getStockQuantity())
                .supplierEntity(supplierEntity)
                .category(productCr.getCategory())
                .visibility(true)
                .build();

        ProductEntity saved = productRepository.save(productEntity);
        return ResponseEntity.ok(toDTO(saved));
    }

    public ResponseEntity<ProductResp> getById(UUID id) {
        ProductEntity productEntity = getProductById(id);
        return ResponseEntity.ok(toDTO(productEntity));
    }

    public ResponseEntity<Page<ProductResp>> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
        List<ProductResp> list = productRepository.findAll(pageable)
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(new PageImpl<>(list, pageable, list.size()));
    }

    public ResponseEntity<ProductResp> update(UUID id, ProductCr productCr) {
        ProductEntity productEntity = getProductById(id);
        SupplierEntity supplierEntity = supplierRepository.findById(productCr.getSupplierId())
                .orElseThrow(() -> new AppBadRequestException("Supplier not found"));

        productEntity.setName(productCr.getName());
        productEntity.setPrice(productCr.getPrice());
        productEntity.setDescription(productCr.getDescription());
        productEntity.setStockQuantity(productCr.getStockQuantity());
        productEntity.setSupplierEntity(supplierEntity);
        productEntity.setCategory(productCr.getCategory());

        ProductEntity saved = productRepository.save(productEntity);
        return ResponseEntity.ok(toDTO(saved));
    }

    public ResponseEntity<String> delete(UUID id) {
        ProductEntity productEntity = getProductById(id);
        productEntity.setVisibility(false);
        productRepository.save(productEntity);
        return ResponseEntity.ok("Product Deleted Successfully");
    }

    public ResponseEntity<PageImpl<ProductResp>> searchProducts(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
        List<ProductResp> list = productRepository.searchProducts(name, pageable)
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(new PageImpl<>(list, pageable, list.size()));
    }

    public ResponseEntity<PageImpl<ProductResp>> getLowStockProducts(int threshold, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("stockQuantity"));
        List<ProductResp> list = productRepository.findByStockQuantityLessThanEqualAndVisibilityTrue(threshold, pageable)
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(new PageImpl<>(list, pageable, list.size()));
    }

    public ResponseEntity<PageImpl<ProductResp>> getProductsBySupplier(UUID supplierId, int page, int size) {
        // Check if supplier exists
        supplierRepository.findByIdAndVisibilityTrue(supplierId)
                .orElseThrow(() -> new AppBadRequestException("Supplier not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
        List<ProductResp> list = productRepository.findBySupplierIdAndVisibilityTrue(supplierId, pageable)
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(new PageImpl<>(list, pageable, list.size()));
    }

    private ProductResp toDTO(ProductEntity productEntity) {
        return ProductResp.builder()
                .id(productEntity.getId())
                .name(productEntity.getName())
                .price(productEntity.getPrice())
                .description(productEntity.getDescription())
                .stockQuantity(productEntity.getStockQuantity())
                .supplierId(productEntity.getSupplierEntity().getId())
                .category(productEntity.getCategory())
                .build();
    }

    private ProductEntity getProductById(UUID id) {
        return productRepository.findByIdAndVisibilityTrue(id)
                .orElseThrow(ItemNotFoundException::new);
    }
}
