package com.company.orders;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrdersRepository extends JpaRepository<OrdersEntity, UUID> {
    Optional<OrdersEntity> findByIdAndVisibilityTrue(UUID id);

    Page<OrdersEntity> findAllByStatusAndVisibilityTrue(Status status, Pageable pageable);

    Page<OrdersEntity> findAllByOrderDateBetweenAndVisibilityTrue(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    List<OrdersEntity> findByStatusAndVisibilityTrue(Status status);
    
    List<OrdersEntity> findByUserIdAndVisibilityTrue(UUID customerId);
    
    @Query("SELECT o FROM OrdersEntity o WHERE o.status IN :statuses AND o.visibility = true")
    List<OrdersEntity> findByStatusesAndVisibilityTrue(@Param("statuses") Collection<Status> statuses);
}