package com.example.demo.dao;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import org.springframework.stereotype.Repository;
import org.thymeleaf.util.ArrayUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Repository
public class RoleDaoImp implements RoleDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Role> findAll() {
        return entityManager.createQuery("from Role", Role.class).getResultList();
    }

    @Override
    public Role findUserById(Long id) {
        return entityManager.find(Role.class, id);
    }

    @Override
    public void saveAll(Collection<Role> roles) {
        for (Role role : roles) {
            entityManager.persist(role);
            entityManager.flush();
        }
    }

    @Override
    public void save(Role role) {
        entityManager.persist(role);
        entityManager.flush();
    }

    @Override
    public void deleteAll(Collection<Role> roles) {
        for (Role role : roles) {
            entityManager.remove(role);
            entityManager.flush();
        }
    }

    @Override
    public Collection<Role> findAllRolesByNameOnDataBase(String[] roles) {
        if (ArrayUtils.contains(roles, "ROLE_ADMIN")) {
            return new ArrayList<>(entityManager.createQuery("select roles from Role roles", Role.class).getResultList());
        } else {
            return new ArrayList<>(entityManager
                    .createQuery("select roles from Role roles where roles.name=:role", Role.class)
                    .setParameter("role", "ROLE_USER")
                    .getResultList());
        }
    }

    @Override
    public Collection<Role> findAllRolesByNameOnDataBase(List<Role> roles) {
        String[] roles1 = roles.stream().map(Role::getName).toList().toArray(new String[0]);

        return findAllRolesByNameOnDataBase(roles1);
    }
}
