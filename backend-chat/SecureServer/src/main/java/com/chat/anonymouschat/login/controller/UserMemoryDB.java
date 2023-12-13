package com.chat.anonymouschat.login.controller;

import com.chat.anonymouschat.login.controller.entity.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;
public class UserMemoryDB {
    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static UserMemoryDB instance = null;
    public Map<String, String> users;
    private UserMemoryDB() {
        users = new HashMap<>();
    }
    public static UserMemoryDB getInstance() {
        if (instance == null) {
            instance = new UserMemoryDB();
        }
        return instance;
    }
    public void addUser(String name, String password) {
        String hashedPassword = passwordEncoder.encode(password);
        users.put(name, hashedPassword);
    }
    public boolean validate(User user) {
        return passwordEncoder.matches(user.getPassword(),users.get(user.getUsername()));

    }
}

