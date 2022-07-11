package com.example.demo.service;


import com.example.demo.model.Role;
import com.example.demo.model.User;

import java.util.Collection;
import java.util.List;

public interface RoleService {

    List<Role> findAll();

    public Role findUserById(Long id);
    void saveAll(Collection<Role> roles);

    void save(Role role);

    void deleteAll(Collection<Role> roles);

    Collection<Role> findAllRolesByNameOnDataBase(String[] roles);

    Collection<Role> findAllRolesByNameOnDataBase(List<Role> roles);
}
