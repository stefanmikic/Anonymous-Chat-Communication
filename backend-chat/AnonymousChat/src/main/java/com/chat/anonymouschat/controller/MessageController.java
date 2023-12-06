package com.chat.anonymouschat.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final List<String> messages = new ArrayList<>(new ArrayList<>(List.of(new String[]{new String("test")})));

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody String messageRequest) {
        String message = messageRequest;

        messages.add(message);

        return new ResponseEntity<>("Message sent successfully!", HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<String>> getAllMessages() {
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
}
