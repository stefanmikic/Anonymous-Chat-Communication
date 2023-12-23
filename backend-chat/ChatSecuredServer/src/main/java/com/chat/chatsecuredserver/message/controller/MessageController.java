package com.chat.chatsecuredserver.message.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.ThreadLocalRandom;

@RestController
public class MessageController {

    private String chatServer1;
    private String chatServer2;
    private String chatServer3;
    private String chatServer4;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/save-message")
    public ResponseEntity<String> forwardMessage(@RequestBody String message) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Replace with your destination URL
        String forwardUrl = getRandomChatServer();
        HttpEntity<String> request = new HttpEntity<>(message, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(forwardUrl, HttpMethod.POST, request, String.class);
            return new ResponseEntity<>("Message forwarded successfully", HttpStatus.OK);
        } catch (RestClientException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to forward message", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String getRandomChatServer(){
        String[] servers = new String[4];
        servers[0] = "https://localhost:8445/save";
        servers[1] = "https://localhost:8446/save";
        servers[2] = "https://localhost:8447/save";
        servers[3] = "https://localhost:443/save";

        return servers[ThreadLocalRandom.current().nextInt(0,4)];
    }

}
