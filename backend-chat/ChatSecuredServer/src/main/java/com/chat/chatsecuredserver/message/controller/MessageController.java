package com.chat.chatsecuredserver.message.controller;

import com.chat.chatsecuredserver.message.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@RestController
public class MessageController {

    private String chatServer1;
    private String chatServer2;
    private String chatServer3;
    private String chatServer4;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private MessageService messageService;

    @PostMapping("/save-message")
    public ResponseEntity<String> forwardMessage(@RequestBody String message) {
        return messageService.forwardMessage(message);
    }

    @GetMapping("all-messages")
    public List<String> getAllMessages(){
        return messageService.drainAllMessagesFromMQs();
    }

    @GetMapping("user-messages")
    public ResponseEntity<List<String>> getUserMessages(@RequestParam String username) {
        return new ResponseEntity<>(messageService.getMessagesForUser(username), HttpStatus.OK);
    }



}
