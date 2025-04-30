package com.company.orderDetails;

import com.company.exception.AppBadRequestException;
import com.company.exception.ItemNotFoundException;
import com.company.orderDetails.dto.OrderDetailsCr;
import com.company.orderDetails.dto.OrderDetailsResp;
import com.company.orders.OrdersEntity;
import com.company.orders.OrdersRepository;
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
public class OrderDetailsService {
    private final OrderDetailsRepository orderDetailsRepository;
    private final OrdersRepository ordersRepository;
    private final ProductRepository productRepository;

    public ResponseEntity<OrderDetailsResp> create(OrderDetailsCr orderDetailsCr) {
        OrdersEntity ordersEntity = ordersRepository.findById(orderDetailsCr.getOrderId())
                .orElseThrow(() -> new AppBadRequestException("Order not found"));
        ProductEntity productEntity = productRepository.findById(orderDetailsCr.getProductId())
                .orElseThrow(() -> new AppBadRequestException("Product not found"));

        OrderDetailsEntity orderDetailsEntity = OrderDetailsEntity.builder()
                .quantity(orderDetailsCr.getQuantity())
                .price(orderDetailsCr.getPrice())
                .ordersEntity(ordersEntity)
                .productEntity(productEntity)
                .visibility(true)
                .build();

        OrderDetailsEntity saved = orderDetailsRepository.save(orderDetailsEntity);
        return ResponseEntity.ok(toDTO(saved));
    }

    public ResponseEntity<OrderDetailsResp> getById(UUID id) {
        OrderDetailsEntity orderDetailsEntity = getOrderDetailsById(id);
        return ResponseEntity.ok(toDTO(orderDetailsEntity));
    }

    public ResponseEntity<Page<OrderDetailsResp>> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
        List<OrderDetailsResp> list = orderDetailsRepository.findAll(pageable)
                .stream()
                .map(this::toDTO)
                .toList();
        return ResponseEntity.ok(new PageImpl<>(list, pageable, list.size()));
    }

    public ResponseEntity<OrderDetailsResp> update(UUID id, OrderDetailsCr orderDetailsCr) {
        OrderDetailsEntity orderDetailsEntity = getOrderDetailsById(id);
        OrdersEntity ordersEntity = ordersRepository.findById(orderDetailsCr.getOrderId())
                .orElseThrow(() -> new AppBadRequestException("Order not found"));
        ProductEntity productEntity = productRepository.findById(orderDetailsCr.getProductId())
                .orElseThrow(() -> new AppBadRequestException("Product not found"));

        orderDetailsEntity.setQuantity(orderDetailsCr.getQuantity());
        orderDetailsEntity.setPrice(orderDetailsCr.getPrice());
        orderDetailsEntity.setOrdersEntity(ordersEntity);
        orderDetailsEntity.setProductEntity(productEntity);

        OrderDetailsEntity saved = orderDetailsRepository.save(orderDetailsEntity);
        return ResponseEntity.ok(toDTO(saved));
    }

    public ResponseEntity<String> delete(UUID id) {
        OrderDetailsEntity orderDetailsEntity = getOrderDetailsById(id);
        orderDetailsEntity.setVisibility(false);
        orderDetailsRepository.save(orderDetailsEntity);
        return ResponseEntity.ok("Order Details Deleted Successfully");
    }

    private OrderDetailsResp toDTO(OrderDetailsEntity orderDetailsEntity) {
        return OrderDetailsResp.builder()
                .id(orderDetailsEntity.getId())
                .quantity(orderDetailsEntity.getQuantity())
                .price(orderDetailsEntity.getPrice())
                .orderId(orderDetailsEntity.getOrderId())
                .productId(orderDetailsEntity.getProductId())
                .build();
    }

    private OrderDetailsEntity getOrderDetailsById(UUID id) {
        return orderDetailsRepository.findByIdAndVisibilityTrue(id)
                .orElseThrow(ItemNotFoundException::new);
    }
}
