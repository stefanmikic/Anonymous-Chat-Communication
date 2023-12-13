package com.chat.anonymouschat.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class MessageController {

    private final List<String> messages = new ArrayList<>(new ArrayList<>(List.of(new String[]{new String("test")})));

    @PostMapping("/send")
    public ResponseEntity<Boolean> sendMessage(@RequestBody String messageRequest) {
        System.out.println("TEST");
        String message = messageRequest;
        return ResponseEntity.ok(true);
    }

    @GetMapping("/all")
    public ResponseEntity<List<String>> getAllMessages() {
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
}
