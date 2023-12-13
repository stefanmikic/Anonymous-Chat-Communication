package com.chat.chatsecuredserver.repository;

import com.chat.chatsecuredserver.login.entity.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;
public class UserInMemoryDB {
    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static UserInMemoryDB instance = null;
    public Map<String, String> users;
    private UserInMemoryDB() {
        users = new HashMap<>();
    }
    public static UserInMemoryDB getInstance() {
        if (instance == null) {
            instance = new UserInMemoryDB();
        }
        return instance;
    }
    public void addUser(String username, String password) {
        String hashedPassword = passwordEncoder.encode(password);
        users.put(username, hashedPassword);
    }
    public boolean validateUser(User user) {
        return passwordEncoder.matches(user.getPassword(),users.get(user.getUsername()));

    }
}

