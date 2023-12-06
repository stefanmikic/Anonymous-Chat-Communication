package com.chat.anonymouschat.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class Message {
    private UUID id;
    private String text;
    private Date date;
    private String fromUsername;
    private String toUsername;
}
