package com.example.demo;

import com.example.demo.service.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

class FirstStartAddAdmin {

    @Autowired
    UserServiceImp userService;

    public void firstStartAddAdmin() {
        userService.addAdmin();
    }
}

@SpringBootApplication
public class DemoApplication {


    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);

    }

    @Bean(initMethod = "firstStartAddAdmin")
    public FirstStartAddAdmin getInitBean() {
        return new FirstStartAddAdmin();
    }

}
