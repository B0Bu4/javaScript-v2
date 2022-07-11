package com.example.demo.dao;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import java.util.List;


@Repository
public interface RoleDao {

    List<Role> findAll();
    public Role findUserById(Long id);
    void saveAll(Collection<Role> roles);

    void save(Role role);

    void deleteAll(Collection<Role> roles);

    Collection<Role> findAllRolesByNameOnDataBase(String[] roles);

    Collection<Role> findAllRolesByNameOnDataBase(List<Role> roles);
}
