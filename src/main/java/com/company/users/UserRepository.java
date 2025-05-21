package com.company.users;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByIdAndVisibilityTrue(UUID id);

    Page<UserEntity> findAllByVisibilityTrue(Pageable pageable);

    Optional<UserEntity> findByEmailAndVisibilityTrue(String email);

    Optional<UserEntity> findByEmailAndPasswordAndVisibilityTrue(String email, String password);

    @Modifying
    @Query("DELETE FROM UserEntity")
    void deleteAllUsers();
}
