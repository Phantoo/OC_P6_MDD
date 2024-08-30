package com.openclassrooms.mddapi.models.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CommentCreationResponse 
{
    String message;
    CommentDto comment;
}
