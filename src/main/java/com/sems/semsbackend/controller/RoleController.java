package com.sems.semsbackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.sems.semsbackend.entity.Role;
import com.sems.semsbackend.service.RoleService;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @PostMapping
    public Role saveRole(@RequestBody Role role) {
        return roleService.saveRole(role);
    }
}