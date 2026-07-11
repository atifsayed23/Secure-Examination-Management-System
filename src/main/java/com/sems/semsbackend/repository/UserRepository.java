package com.sems.semsbackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sems.semsbackend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByEmployeeId(String employeeId);
    long countByRoleRoleName(String roleName);
    java.util.List<User> findByRoleRoleName(String roleName);

}