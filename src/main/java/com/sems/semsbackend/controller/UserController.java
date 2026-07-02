package com.sems.semsbackend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sems.semsbackend.entity.User;
import com.sems.semsbackend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Only SUPER_ADMIN can view all users
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Only SUPER_ADMIN can create users
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // Only SUPER_ADMIN can delete users
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}