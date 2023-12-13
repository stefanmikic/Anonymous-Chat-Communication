package com.chat.chatsecuredserver.login.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    //login for users
    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@RequestBody String str){
        return ResponseEntity.ok(true);
    }
}
