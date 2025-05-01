package com.company.product;

import com.company.product.dto.ProductCr;
import com.company.product.dto.ProductResp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResp> create(@RequestBody ProductCr productCr) {
        return productService.create(productCr);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResp> getById(@PathVariable UUID id) {
        return productService.getById(id);
    }

    @GetMapping
    public ResponseEntity<Page<ProductResp>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return productService.getAll(page, size);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResp> update(@PathVariable UUID id, @RequestBody ProductCr productCr) {
        return productService.update(id, productCr);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        return productService.delete(id);
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<PageImpl<ProductResp>> searchByName(@PathVariable String name,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        return productService.searchProducts(name, page, size);
    }

    @GetMapping("/get-low-stock-products")
    public ResponseEntity<PageImpl<ProductResp>> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return productService.getLowStockProducts(threshold, page, size);
    }

    @GetMapping("/get-products-by-supplier/{supplierId}")
    public ResponseEntity<PageImpl<ProductResp>> getProductsBySupplier(
            @PathVariable UUID supplierId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return productService.getProductsBySupplier(supplierId, page, size);
    }
}
