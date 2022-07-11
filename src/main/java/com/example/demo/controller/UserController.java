package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UserController {

    @GetMapping("/user")
    public String snowUserList() {
        return "user";
    }

    @GetMapping("/login")
    public String snowLogin() {
        return "login";
    }

    @GetMapping("/")
    public String snowIndex() {
        return "login";
    }
}
