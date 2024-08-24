package com.openclassrooms.mddapi.controllers;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.models.dto.ArticleDto;
import com.openclassrooms.mddapi.services.ArticleService;

@RestController
@RequestMapping("articles")
public class ArticleController 
{
    @Autowired
    private ArticleService articleService;

    @Autowired
    private ModelMapper mapper;

    @GetMapping("/{id}")
    public ResponseEntity<ArticleDto> findById(@PathVariable String id) 
    {
        try {
            Article article = this.articleService.findById(Integer.valueOf(id));
            if (article == null) {
                return ResponseEntity.notFound().build();
            }

            ArticleDto dto = mapper.map(article, ArticleDto.class);
            return ResponseEntity.ok().body(dto);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<ArticleDto>> findAll() 
    {
        List<Article> articles = this.articleService.findAll();
        List<ArticleDto> dtos = mapper.map(articles, new TypeToken<List<ArticleDto>>() {}.getType());
        return ResponseEntity.ok().body(dtos);
    }
}
