package com.company.orders;

import com.company.orderdetails.OrderDetailsEntity;
import com.company.users.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class OrdersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "visibility")
    private Boolean visibility;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "status")
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;
    @Column(name = "user_id", insertable = false, updatable = false)
    private UUID userId;

    @OneToMany(mappedBy = "ordersEntity")
    private List<OrderDetailsEntity> orderDetailsEntities;






}
