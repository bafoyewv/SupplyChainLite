package com.company.product;

import com.company.inventory.InventoryEntity;
import com.company.orderDetails.OrderDetailsEntity;
import com.company.supplier.SupplierEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product")
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "visibility")
    private Boolean visibility;

    @Column(name = "title", nullable = false)
    private String name;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;


    @OneToMany(mappedBy = "productEntity")
    private List<OrderDetailsEntity> orderDetailsEntities;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private SupplierEntity supplierEntity;
    @Column(name = "supplier_id", insertable = false, updatable = false, nullable = false)
    private UUID supplierId;


    @OneToMany(mappedBy = "productEntity")
    private List<InventoryEntity> inventoryEntities;

}
