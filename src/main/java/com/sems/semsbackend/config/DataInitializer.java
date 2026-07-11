package com.sems.semsbackend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.sems.semsbackend.entity.Role;
import com.sems.semsbackend.repository.RoleRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {

        createRoleIfNotExists("SUPER_ADMIN");
        createRoleIfNotExists("PAPER_SETTER");
        createRoleIfNotExists("MODERATOR");
        createRoleIfNotExists("FACULTY");
        createRoleIfNotExists("EXAM_CONTROLLER");
        createRoleIfNotExists("EXAM_CENTER_ADMIN");
    }

    private void createRoleIfNotExists(String roleName) {
        if (roleRepository.findByRoleName(roleName).isEmpty()) {
            Role role = new Role();
            role.setRoleName(roleName);
            roleRepository.save(role);
            System.out.println("Created role: " + roleName);
        }
    }
}