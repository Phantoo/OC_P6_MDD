package com.openclassrooms.mddapi.models.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto 
{
    private Integer id;
    
    private String content;
    
    private AuthorDto author;

    private Date createdAt;
}