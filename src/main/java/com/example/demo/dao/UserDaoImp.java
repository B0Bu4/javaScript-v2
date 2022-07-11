package com.example.demo.dao;

import com.example.demo.model.User;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class UserDaoImp implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public User findUserByEmail(String email) throws NoResultException {
        return (User) entityManager.createQuery("select user from User user where user.email =:email")
                .setParameter("email", email).getSingleResult();
    }

    @Override
    public User findUserById(Long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public List<User> findAll() {
        return entityManager.createQuery("select users from User users", User.class)
                .getResultList();
    }

    @Override
    public void save(User user) {
        entityManager.persist(user);
    }

    @Override
    public void saveAndFlush(User user) {
        entityManager.merge(user);
    }

    @Override
    public void deleteById(Long id) {
        entityManager.remove(findUserById(id));
    }
}
