package com.company.supplier;

import com.company.supplier.dto.SupplierCr;
import com.company.supplier.dto.SupplierResp;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class SupplierTest {

    @Autowired
    private SupplierService supplierService;

    @Test
    public void testCreateSupplier() {
        SupplierCr supplierCr = new SupplierCr();
        supplierCr.setName("Test Supplier");
        supplierCr.setContact_info("test@example.com");
        supplierCr.setAddress("Test Address");

        ResponseEntity<SupplierResp> response = supplierService.create(supplierCr);
        assertNotNull(response);
        assertNotNull(response.getBody());
        assertEquals("Test Supplier", response.getBody().getName());
        assertEquals("test@example.com", response.getBody().getContact_info());
        assertEquals("Test Address", response.getBody().getAddress());
    }

    @Test
    public void testGetSupplierById() {
        // First create a supplier
        SupplierCr supplierCr = new SupplierCr();
        supplierCr.setName("Test Supplier 2");
        supplierCr.setContact_info("test2@example.com");
        supplierCr.setAddress("Test Address 2");

        ResponseEntity<SupplierResp> createResponse = supplierService.create(supplierCr);
        UUID supplierId = createResponse.getBody().getId();

        // Then get it by ID
        ResponseEntity<SupplierResp> getResponse = supplierService.getbyId(supplierId);
        assertNotNull(getResponse);
        assertNotNull(getResponse.getBody());
        assertEquals(supplierId, getResponse.getBody().getId());
        assertEquals("Test Supplier 2", getResponse.getBody().getName());
    }

    @Test
    public void testUpdateSupplier() {
        // First create a supplier
        SupplierCr supplierCr = new SupplierCr();
        supplierCr.setName("Test Supplier 3");
        supplierCr.setContact_info("test3@example.com");
        supplierCr.setAddress("Test Address 3");

        ResponseEntity<SupplierResp> createResponse = supplierService.create(supplierCr);
        UUID supplierId = createResponse.getBody().getId();

        // Then update it
        SupplierCr updateCr = new SupplierCr();
        updateCr.setName("Updated Supplier");
        updateCr.setContact_info("updated@example.com");
        updateCr.setAddress("Updated Address");

        ResponseEntity<SupplierResp> updateResponse = supplierService.update(supplierId, updateCr);
        assertNotNull(updateResponse);
        assertNotNull(updateResponse.getBody());
        assertEquals("Updated Supplier", updateResponse.getBody().getName());
        assertEquals("updated@example.com", updateResponse.getBody().getContact_info());
        assertEquals("Updated Address", updateResponse.getBody().getAddress());
    }
} 