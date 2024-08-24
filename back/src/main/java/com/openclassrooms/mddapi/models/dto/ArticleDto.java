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
public class ArticleDto 
{
    private Integer id;
    
    private String title;
    
    private String content;
    
    private UserDto author;

    private SubjectDto subject;

    private Date createdAt;
}
