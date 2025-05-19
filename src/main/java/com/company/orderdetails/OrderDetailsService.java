package com.company.orderdetails;

import com.company.exception.AppBadRequestException;
import com.company.exception.ItemNotFoundException;
import com.company.inventory.InventoryService;
import com.company.orderdetails.dto.OrderDetailsCr;
import com.company.orderdetails.dto.OrderDetailsResp;
import com.company.orderdetails.dto.OrderSummaryDTO;
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
     * @return List of orders with PENDING status
     */
    public ResponseEntity<List<OrdersEntity>> getPendingOrders() {
        List<Status> pendingStatuses = Arrays.asList(Status.PENDING, Status.IN_PROGRESS);
        List<OrdersEntity> pendingOrders = ordersRepository.findByStatusesAndVisibilityTrue(pendingStatuses);
        return ResponseEntity.ok(pendingOrders);
    }

    /**
     * Update the status of an order
     * @param orderId The order ID
     * @param status The new status
     * @return The updated order
     */
    @Transactional
    public ResponseEntity<OrdersEntity> updateOrderStatus(UUID orderId, String status) {
        OrdersEntity order = ordersRepository.findByIdAndVisibilityTrue(orderId)
                .orElseThrow(() -> new AppBadRequestException("Order not found"));
        
        try {
            Status newStatus = Status.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
            OrdersEntity savedOrder = ordersRepository.save(order);
            return ResponseEntity.ok(savedOrder);
        } catch (IllegalArgumentException e) {
            throw new AppBadRequestException("Invalid status: " + status);
        }
    }

    /**
     * Cancel an order and release reserved inventory
     * @param orderId The order ID to cancel
     * @return Message indicating success
     */


    /**
     * Get all orders for a specific customer
     * @param customerId The customer ID
     * @return List of orders for the customer
     */
    public ResponseEntity<List<OrdersEntity>> getOrdersByCustomerId(UUID customerId) {
        List<OrdersEntity> customerOrders = ordersRepository.findByUserIdAndVisibilityTrue(customerId);
        return ResponseEntity.ok(customerOrders);
    }

    /**
     * Calculate the total price of an order
     * @param orderId The order ID
     * @return The total price of the order
     */
    public ResponseEntity<BigDecimal> calculateTotalOrderPrice(UUID orderId) {
        // Check if order exists
        ordersRepository.findByIdAndVisibilityTrue(orderId)
                .orElseThrow(() -> new AppBadRequestException("Order not found"));
        
        BigDecimal totalPrice = orderDetailsRepository.calculateTotalOrderPrice(orderId);
        return ResponseEntity.ok(totalPrice != null ? totalPrice : BigDecimal.ZERO);
    }

    /**
     * Get order summary within a date range
     * @param fromDate Start date
     * @param toDate End date
     * @return Summary of orders within the date range
     */
    public ResponseEntity<OrderSummaryDTO> getOrderSummaryByDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate.isAfter(toDate)) {
            throw new AppBadRequestException("From date must be before to date");
        }
        
        List<OrderDetailsEntity> orderDetails = orderDetailsRepository.findByDateRangeAndVisibilityTrue(fromDate, toDate);
        
        // Calculate total orders
        Set<UUID> uniqueOrderIds = orderDetails.stream()
                .map(OrderDetailsEntity::getOrderId)
                .collect(Collectors.toSet());
        
        // Calculate total revenue
        BigDecimal totalRevenue = orderDetails.stream()
                .map(detail -> detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate total items sold
        int totalItemsSold = orderDetails.stream()
                .mapToInt(OrderDetailsEntity::getQuantity)
                .sum();
        
        // Create summary
        OrderSummaryDTO summary = OrderSummaryDTO.builder()
                .fromDate(fromDate)
                .toDate(toDate)
                .totalOrders(uniqueOrderIds.size())
                .totalRevenue(totalRevenue)
                .totalItemsSold(totalItemsSold)
                .build();
        
        return ResponseEntity.ok(summary);
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
