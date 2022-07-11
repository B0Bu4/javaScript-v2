package com.example.demo.dao;

import com.example.demo.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDao {

    User findUserByEmail(String email);

    User findUserById(Long id);

    List<User> findAll();

    void save(User user);

    void saveAndFlush(User user);

    void deleteById(Long id);

}
