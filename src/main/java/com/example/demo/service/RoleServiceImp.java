package com.example.demo.service;

import com.example.demo.dao.RoleDao;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.List;

@Service
public class RoleServiceImp implements RoleService {

    private RoleDao roleDao;


    @Autowired
    public RoleServiceImp(RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    @Override
    public List<Role> findAll() {
        return roleDao.findAll();
    }

    @Override
    public Role findUserById(Long id) {
        return roleDao.findUserById(id);
    }

    @Override
    @Transactional
    public void saveAll(Collection<Role> roles) {
        roleDao.saveAll(roles);
    }

    @Override
    @Transactional
    public void save(Role role) {
        roleDao.save(role);
    }

    @Override
    @Transactional
    public void deleteAll(Collection<Role> roles) {
        roleDao.deleteAll(roles);
    }

    @Override
    @Transactional
    public Collection<Role> findAllRolesByNameOnDataBase(String[] roles) {
        return roleDao.findAllRolesByNameOnDataBase(roles);
    }

    @Override
    @Transactional
    public Collection<Role> findAllRolesByNameOnDataBase(List<Role> roles) {
        return roleDao.findAllRolesByNameOnDataBase(roles);
    }
}

