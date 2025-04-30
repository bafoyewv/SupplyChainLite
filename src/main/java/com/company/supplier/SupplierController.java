package com.company.supplier;

import com.company.supplier.dto.SupplierCr;
import com.company.supplier.dto.SupplierResp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

@RestController
@RequestMapping("/api/v1/supply")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping("/add")
    public ResponseEntity<SupplierResp> create(@RequestBody SupplierCr supplier) {
        return supplierService.create(supplier);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<SupplierResp> getById(@PathVariable UUID id) {
        return supplierService.getbyId(id);
    }

    @GetMapping("/get-all")
    public ResponseEntity<Page<SupplierResp>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return supplierService.getAll(page, size);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SupplierResp> update(@PathVariable UUID id, @RequestBody SupplierCr supplier) {
        return supplierService.update(id, supplier);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        return supplierService.delete(id);
    }

}
