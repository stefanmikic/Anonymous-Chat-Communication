package com.chat.chatsecuredserver.message.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class MessageService {

    @Autowired
    private RestTemplate restTemplate;

    public ResponseEntity<String> forwardMessage(String message) {
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

    public List<String> drainAllMessagesFromMQs() {
        List<String> allMessages = new ArrayList<>();

        // List of server URLs
        String[] serverUrls = {
                "https://localhost:8445/drain",
                "https://localhost:8446/drain",
                "https://localhost:8447/drain",
                "https://localhost:443/drain"
        };

        for (String serverUrl : serverUrls) {
            try {
                // Create URL object
                URL url = new URL(serverUrl);

                // Open a connection
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();

                // Set request method
                connection.setRequestMethod("GET");

                // Get the response
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;

                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }

                reader.close();

                // Add the retrieved message to the list
                allMessages.add(response.toString());

                // Disconnect the connection
                connection.disconnect();

            } catch (IOException e) {
                // Handle exceptions or log errors here
                e.printStackTrace();
            }
        }

        return allMessages;
    }

    public List<String> getMessagesForUser(String username) {
        List<String> allMessages = drainAllMessagesFromMQs();
        List<String> userMessages = new ArrayList<>();
        allMessages.forEach(msg -> {
            if (!msg.isEmpty()) {
                String[] parts = msg.split("@@");
                for(int i = 0; i < parts.length; i++) {
                    if(parts[i].split("p@rt")[4].equals(username)) {
                        userMessages.add(parts[i]);
                    }
                    else {
                        forwardMessage(parts[i] + "@@");
                    }
                }
            }
        });
        return userMessages;
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
