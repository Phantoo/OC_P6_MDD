package com.openclassrooms.mddapi.models.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentCreationRequest 
{
    String content;
    Integer authorId;
}
