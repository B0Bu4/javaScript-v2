package com.example.demo.controller;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.service.RoleService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class RestJavaScriptController {

    private final UserService userService;

    private final RoleService roleService;

    @Autowired
    public RestJavaScriptController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/users")
    public List<User> showAllUsers() {
        return userService.findAll();

    }
    @GetMapping("/users-roles")
    public List<Role> showAllRoles() {
        return roleService.findAll();

    }

    @GetMapping("/users/{id}")
    public User showUserById(@PathVariable long id) {
        return userService.findUserById(id);
    }

    @PostMapping("/users")
    public List<User> addNewUser(@RequestBody User user) {

        userService.save(user);
        return userService.findAll();
    }

    @PutMapping("/users")
    public List<User> updateUser(@RequestBody User user) {
        userService.saveAndFlush(user);
        return userService.findAll();
    }
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable long id){
        userService.deleteById(id);
    }

    @GetMapping("/principal")
    public User executePrincipal(Principal principal) {
        return userService.findUserByEmail(principal.getName());
    }
}
