package com.chat.chatsecuredserver.login.controller;

import com.chat.chatsecuredserver.login.entity.User;
import com.chat.chatsecuredserver.repository.UserInMemoryDB;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class LoginController {

    public static List<String> loggedInUsers = new ArrayList<>();


    //endpoint for users login
    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@RequestBody User user){
        UserInMemoryDB db = UserInMemoryDB.getInstance();
        loggedInUsers.add(user.getUsername());
        return ResponseEntity.ok(db.validateUser(user));
    }

    //endpoint for users logout
    @PostMapping("/logout")
    public String logout(@RequestBody User user) {
        loggedInUsers.remove(user.getUsername());
        return "Logout successful";
    }

    //endpoint to get currently logged-in users
    @GetMapping("/logged-in-users")
    public List<String> getLoggedInUsers() {
        return loggedInUsers;
    }
}
