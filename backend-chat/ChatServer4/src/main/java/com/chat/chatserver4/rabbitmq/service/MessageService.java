package com.chat.chatserver4.rabbitmq.service;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageService {
    @Autowired
    RabbitTemplate rabbitTemplate;


    //draining all messages from queue
    public String drain(String queueName)
    {
        String mess="";

        while (true) {
            String tmp="";
            Message message = rabbitTemplate.receive(queueName);
            if(message!=null)
            {
                tmp = new String(message.getBody());
                mess+=tmp;
            }
            else{
                break;
            }
        }
        return mess;
    }

}
