package com.chat.chatsecuredserver.login.controller;

import com.chat.chatsecuredserver.login.entity.User;
import com.chat.chatsecuredserver.repository.UserInMemoryDB;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    //login for users
    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@RequestBody User user){
        UserInMemoryDB db = UserInMemoryDB.getInstance();
        return ResponseEntity.ok(db.validateUser(user));
    }
}
