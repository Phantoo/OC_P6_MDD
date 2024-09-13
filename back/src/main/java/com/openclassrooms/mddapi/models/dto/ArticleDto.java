package com.openclassrooms.mddapi.models.dto;

import java.util.Date;
import java.util.List;

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
    
    private AuthorDto author;

    private SubjectDto subject;

    private Date createdAt;

    private List<CommentDto> comments;
}
