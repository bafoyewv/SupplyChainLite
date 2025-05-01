package com.company.orders;

import com.company.exception.AppBadRequestException;
import com.company.exception.ItemNotFoundException;
import com.company.orders.dto.OrdersCr;
import com.company.orders.dto.OrdersResp;
import com.company.users.UserEntity;
import com.company.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrdersService {
    private final OrdersRepository ordersRepository;
    private final UserRepository userRepository;

    public ResponseEntity<OrdersResp> create(OrdersCr ordersCr) {
        UserEntity userEntity = userRepository.findById(ordersCr.getUserId())
                .orElseThrow(() -> new AppBadRequestException("User not found"));

        OrdersEntity ordersEntity = OrdersEntity.builder()
                .orderDate(ordersCr.getOrderDate())
                .status(ordersCr.getStatus())
                .userEntity(userEntity)
                .visibility(true)
                .build();

        OrdersEntity saved = ordersRepository.save(ordersEntity);
        return ResponseEntity.ok(toDTO(saved));
    }

    public ResponseEntity<OrdersResp> getById(UUID id) {
        OrdersEntity ordersEntity = getOrderById(id);
        return ResponseEntity.ok(toDTO(ordersEntity));
    }

    public ResponseEntity<Page<OrdersResp>> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate"));
        List<OrdersResp> list = ordersRepository.findAll(pageable)
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(new PageImpl<>(list, pageable, list.size()));
    }

    public ResponseEntity<OrdersResp> update(UUID id, OrdersCr ordersCr) {
        OrdersEntity ordersEntity = getOrderById(id);
        UserEntity userEntity = userRepository.findById(ordersCr.getUserId())
                .orElseThrow(() -> new AppBadRequestException("User not found"));

        ordersEntity.setOrderDate(ordersCr.getOrderDate());
        ordersEntity.setStatus(ordersCr.getStatus());
        ordersEntity.setUserEntity(userEntity);

        OrdersEntity saved = ordersRepository.save(ordersEntity);
        return ResponseEntity.ok(toDTO(saved));
    }

    public ResponseEntity<String> delete(UUID id) {
        OrdersEntity ordersEntity = getOrderById(id);
        ordersEntity.setVisibility(false);
        ordersRepository.save(ordersEntity);
        return ResponseEntity.ok("Order Deleted Successfully");
    }

    public ResponseEntity<Page<OrdersResp>> getOrdersByStatus(Status status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate"));
        List<OrdersResp> list = ordersRepository.findAllByStatusAndVisibilityTrue(status, pageable)
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(new PageImpl<>(list, pageable, list.size()));
    }

    private OrdersResp toDTO(OrdersEntity ordersEntity) {
        return OrdersResp.builder()
                .id(ordersEntity.getId())
                .orderDate(ordersEntity.getOrderDate())
                .status(ordersEntity.getStatus())
                .userId(ordersEntity.getUserId())
                .build();
    }

    private OrdersEntity getOrderById(UUID id) {
        return ordersRepository.findByIdAndVisibilityTrue(id)
                .orElseThrow(ItemNotFoundException::new);
    }
} 