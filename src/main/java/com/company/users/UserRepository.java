package com.company.users;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmailAndVisibilityTrue(String email);

    Optional<UserEntity> findByIdAndVisibilityTrue(UUID id);

    Page<UserEntity> findAllByVisibilityTrue(Pageable pageable);
}
