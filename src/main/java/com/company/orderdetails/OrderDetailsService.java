package com.company.orderdetails;

import com.company.exception.AppBadRequestException;
import com.company.exception.ItemNotFoundException;
import com.company.inventory.InventoryService;
import com.company.orderdetails.dto.OrderDetailsCr;
import com.company.orderdetails.dto.OrderDetailsResp;
import com.company.orderdetails.dto.OrderSummaryDTO;
import com.company.orders.OrderStatus;
import com.company.orders.OrdersEntity;
import com.company.orders.OrdersRepository;
import com.company.orders.Status;
import com.company.product.ProductEntity;
import com.company.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderDetailsService {
    private final OrderDetailsRepository orderDetailsRepository;
    private final OrdersRepository ordersRepository;
    private final ProductRepository productRepository;
    private final InventoryService inventoryService;

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

    /**
     * Get all pending orders that have not been fulfilled yet
     */
    public List<OrdersEntity> getPendingOrders() {
        return ordersRepository.findAllByStatusAndVisibilityTrue(OrderStatus.PENDING);
    }

    /**
     * Update the status of an order
     */
    @Transactional
    public OrdersEntity updateOrderStatus(UUID orderId, String status) {
        var order = ordersRepository.findByIdAndVisibilityTrue(orderId)
                .orElseThrow(() -> new AppBadRequestException("Order topilmadi!"));

        if (order.getStatus() == Status.CANCELLED) {
            throw new AppBadRequestException("Bekor qilingan buyurtmani o'zgartirib bo'lmaydi!");
        }

        try {
            Status newStatus = Status.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
            return ordersRepository.save(order);
        } catch (IllegalArgumentException e) {
            throw new AppBadRequestException("Noto'g'ri status: " + status);
        }
    }

    /**
     * Cancel an order and return products to inventory
     */
    @Transactional
    public void cancelOrder(UUID orderId) {
        var order = ordersRepository.findByIdAndVisibilityTrue(orderId)
                .orElseThrow(() -> new AppBadRequestException("Order topilmadi!"));

        if (order.getStatus() == Status.CANCELLED) {
            throw new AppBadRequestException("Buyurtma allaqachon bekor qilingan!");
        }

        if (order.getStatus() == Status.DELIVERED) {
            throw new AppBadRequestException("Yetkazilgan buyurtmani bekor qilib bo'lmaydi!");
        }

        // Return products to inventory
        order.getOrderDetailsEntities().forEach(detail -> {
            var product = detail.getProductEntity();
            product.setStockQuantity(product.getStockQuantity() + detail.getQuantity());
            productRepository.save(product);
        });

        order.setStatus(Status.CANCELLED);
        ordersRepository.save(order);
    }

    /**
     * Get all orders for a specific customer
     */
    public List<OrdersEntity> getOrdersByCustomerId(UUID customerId) {
        return ordersRepository.findAllByUserIdAndVisibilityTrue(customerId);
    }

    /**
     * Calculate the total price of an order
     */
    public BigDecimal calculateTotalOrderPrice(UUID orderId) {
        var order = ordersRepository.findByIdAndVisibilityTrue(orderId)
                .orElseThrow(() -> new AppBadRequestException("Order topilmadi!"));

        return order.getOrderDetailsEntities().stream()
                .map(detail -> detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Get order summary within a date range
     */
    public Map<LocalDate, List<OrdersEntity>> getOrderSummaryByDateRange(LocalDate from, LocalDate to) {
        if (from.isAfter(to)) {
            throw new AppBadRequestException("Boshlang'ich sana tugash sanasidan keyin bo'lmasligi kerak!");
        }

        var orders = ordersRepository.findAllByOrderDateBetweenAndVisibilityTrue(from, to);
        return orders.stream()
                .collect(Collectors.groupingBy(OrdersEntity::getOrderDate));
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
