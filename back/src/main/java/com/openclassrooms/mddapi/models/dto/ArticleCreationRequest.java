package com.openclassrooms.mddapi.models.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArticleCreationRequest 
{
    String title;
    String content;
    Integer authorId;
    Integer subjectId;
}
