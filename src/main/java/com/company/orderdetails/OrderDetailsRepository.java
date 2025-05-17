package com.company.orderdetails;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderDetailsRepository extends JpaRepository<OrderDetailsEntity, UUID> {
    Optional<OrderDetailsEntity> findByIdAndVisibilityTrue(UUID id);
    
    List<OrderDetailsEntity> findByOrderIdAndVisibilityTrue(UUID orderId);
    
    @Query("SELECT od FROM OrderDetailsEntity od JOIN od.ordersEntity o WHERE o.userId = :customerId AND od.visibility = true")
    List<OrderDetailsEntity> findByCustomerIdAndVisibilityTrue(@Param("customerId") UUID customerId);
    
    @Query("SELECT SUM(od.price * od.quantity) FROM OrderDetailsEntity od WHERE od.orderId = :orderId AND od.visibility = true")
    BigDecimal calculateTotalOrderPrice(@Param("orderId") UUID orderId);
    
    @Query("SELECT od FROM OrderDetailsEntity od JOIN od.ordersEntity o WHERE o.orderDate BETWEEN :fromDate AND :toDate AND od.visibility = true")
    List<OrderDetailsEntity> findByDateRangeAndVisibilityTrue(@Param("fromDate") LocalDate fromDate, @Param("toDate") LocalDate toDate);
}
