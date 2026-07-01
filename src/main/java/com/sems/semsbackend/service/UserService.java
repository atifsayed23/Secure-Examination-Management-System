package com.sems.semsbackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sems.semsbackend.entity.User;
import com.sems.semsbackend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Save a new user
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Find user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Find user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Delete user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}