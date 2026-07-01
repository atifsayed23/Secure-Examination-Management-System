package com.sems.semsbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sems.semsbackend.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

}