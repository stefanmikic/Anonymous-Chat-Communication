package com.chat.chatsecuredserver.message.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class MessageService {

    
    /*public void processMessage(String message){
        int numOfParts = selectRandomValue();



    }

    //splits message into equal number of parts
    private String[] splitMessage(String message, int numOfParts){
        String[] parts = new String[numOfParts];
        int partLength = (int) Math.ceil(message.length()/numOfParts);
        int startIndex = 0;

        for(int i = 0; i<numOfParts; i++){
            int endIndex = Math.min(startIndex + partLength, message.length());
            parts[i] = message.substring(startIndex, endIndex);
            startIndex = endIndex;
        }

        return parts;
    }
//returns random number between startValue and endValue
    private int selectRandomValue(){
        int startValue = 3;
        int endValue = 11;
        return ThreadLocalRandom.current().nextInt(startValue, endValue);
    }*/


}
