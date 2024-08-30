package com.openclassrooms.mddapi.models.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ArticleCreationResponse 
{
    String message;
    ArticleDto article;
}
