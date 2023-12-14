package com.chat.chatserver1.rabbitmq.controller;

import com.chat.chatserver1.rabbitmq.service.MessageService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    private final MessageService messageService;
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }


    @GetMapping("/drain")
    public String getMessage()
    {
        String response =messageService.drain("chatServer1Queue");
        return response;
    }
    @PostMapping("/save")
    public ResponseEntity<Boolean> saveMessage(@RequestBody String message)
    {
        rabbitTemplate.convertAndSend("", "chatServer1Queue", message);
        return ResponseEntity.ok(true);
    }
}
