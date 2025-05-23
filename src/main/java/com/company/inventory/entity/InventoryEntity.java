package com.company.inventory.entity;

import com.company.product.ProductEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Table(name = "inventory")
public class InventoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id",updatable = false, nullable = false)
    private UUID id;

    @Column(name = "visibility")
    private Boolean visibility;

    @Column(name = "quantity_in_stock",nullable = false)
    private Integer quantityInStock;


    @CreationTimestamp
    @Column(name = "last_restock_date",nullable = false)
    private LocalDateTime lastRestockDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private ProductEntity productEntity;
    @Column(name = "product_id", insertable = false, updatable = false, nullable = false)
    private UUID productId;


}
