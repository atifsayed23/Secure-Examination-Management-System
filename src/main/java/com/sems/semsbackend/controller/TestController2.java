package com.sems.semsbackend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController2 {
    @PutMapping("/secure")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public String putSecure() {
        return "Secure PUT Access Granted!";
    }
}
