package com.company.supplier;

import com.company.exception.AppBadRequestException;
import com.company.exception.ItemNotFoundException;
import com.company.product.ProductEntity;
import com.company.product.dto.ProductResp;
import com.company.supplier.dto.SupplierCr;
import com.company.supplier.dto.SupplierResp;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public ResponseEntity<SupplierResp> create(SupplierCr supplierCr) {
        Optional<SupplierEntity> optionalSupplier = supplierRepository.findByName(supplierCr.getName());

        if (optionalSupplier.isPresent()) {
            throw new AppBadRequestException("Supplier already exists");
        }

        SupplierEntity supplierEntity =SupplierEntity.builder()
                .name(supplierCr.getName())
                .contactInfo(supplierCr.getContact_info())
                .address(supplierCr.getAddress())
                .build();

        SupplierEntity savedSupplier = supplierRepository.save(supplierEntity);
        return ResponseEntity.ok(toDTO(savedSupplier));
    }

    public ResponseEntity<SupplierResp> getbyId(UUID id){
        SupplierEntity supplierEntity = supplierRepository.findById(id).orElseThrow(ItemNotFoundException::new);
        return ResponseEntity.ok(toDTO(supplierEntity));
    }

    public ResponseEntity<Page<SupplierResp>> getAll(int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));

        List<SupplierResp> list = supplierRepository.findAll(pageable)
                .stream()
                .map(this::toDTO)
                .toList();

        return ResponseEntity.ok(new PageImpl<>(list, pageable, list.size()));
    }

    public ResponseEntity<SupplierResp> update(UUID id, SupplierCr supplierCr) {
        SupplierEntity supplierEntity = supplierRepository
                .findById(id)
                .orElseThrow(ItemNotFoundException::new);

        Optional<SupplierEntity> optionalSupplier = supplierRepository.findByName(supplierCr.getName());
        if (optionalSupplier.isPresent()) {
            throw new AppBadRequestException("Supplier already exists");
        }

        supplierEntity.setName(supplierCr.getName());
        supplierEntity.setContactInfo(supplierCr.getContact_info());
        supplierEntity.setAddress(supplierCr.getAddress());

        SupplierEntity saved = supplierRepository.save(supplierEntity);
        return ResponseEntity.ok(toDTO(saved));
    }

    public ResponseEntity<String> delete(UUID id) {
        SupplierEntity supplierEntity = supplierRepository
                .findByIdAndVisibilityTrue(id)
                .orElseThrow(ItemNotFoundException::new);

        supplierEntity.setVisibility(false);
        supplierRepository.save(supplierEntity);
        return ResponseEntity.ok("Supplier was successfully deleted !");
    }

    private SupplierResp toDTO(SupplierEntity supplierEntity) {
        return SupplierResp.builder()
                .id(supplierEntity.getId())
                .name(supplierEntity.getName())
                .contact_info(supplierEntity.getContactInfo())
                .address(supplierEntity.getAddress())
                .build();
    }
}
