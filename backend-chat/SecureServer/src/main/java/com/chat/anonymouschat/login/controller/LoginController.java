package com.chat.anonymouschat.login.controller;

import com.chat.anonymouschat.login.controller.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class LoginController {

    UserMemoryDB db = UserMemoryDB.getInstance();

    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@RequestBody User user) {
        return ResponseEntity.ok(db.validate(user));
    }
}
