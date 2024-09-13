package com.openclassrooms.mddapi.controllers;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.models.Comment;
import com.openclassrooms.mddapi.models.dto.ArticleCreationRequest;
import com.openclassrooms.mddapi.models.dto.ArticleCreationResponse;
import com.openclassrooms.mddapi.models.dto.ArticleDto;
import com.openclassrooms.mddapi.models.dto.CommentCreationRequest;
import com.openclassrooms.mddapi.models.dto.CommentCreationResponse;
import com.openclassrooms.mddapi.models.dto.CommentDto;
import com.openclassrooms.mddapi.services.ArticleService;

import io.micrometer.common.util.StringUtils;
import jakarta.transaction.Transactional;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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
    
    // @GetMapping
    // public ResponseEntity<List<ArticleDto>> findAll() 
    // {
    //     List<Article> articles = this.articleService.findAll();
    //     List<ArticleDto> dtos = mapper.map(articles, new TypeToken<List<ArticleDto>>() {}.getType());
    //     return ResponseEntity.ok().body(dtos);
    // }

    @GetMapping
    public ResponseEntity<Page<ArticleDto>> findAll(@RequestParam List<Integer> subjects, Pageable pageable) 
    {
        Page<Article> articles = this.articleService.findAll(subjects, pageable);
        Page<ArticleDto> dtos = articles.map(article -> {
            return mapper.map(article, ArticleDto.class);
        });
        // Page<ArticleDto> dtos = mapper.map(articles, new TypeToken<Page<ArticleDto>>() {}.getType());
        return ResponseEntity.ok().body(dtos);
    }

    @PostMapping
    public ResponseEntity<ArticleCreationResponse> add(@RequestBody ArticleCreationRequest creationRequest) 
    {
        if (StringUtils.isBlank(creationRequest.getTitle()) ||
            StringUtils.isBlank(creationRequest.getContent()) ||
            creationRequest.getAuthorId() == null ||
            creationRequest.getSubjectId() == null) 
        {
            ArticleCreationResponse response = new ArticleCreationResponse("One or more field are empty.", null);
            return ResponseEntity.badRequest().body(response);
        }

        Article article = this.articleService.add(creationRequest);
        ArticleDto dto = mapper.map(article, ArticleDto.class);
        ArticleCreationResponse response = new ArticleCreationResponse("Successfully created article !", dto);
        return ResponseEntity.ok().body(response);
    }
    
    @PostMapping("{id}/comment")
    @Transactional
    public ResponseEntity<CommentCreationResponse> comment(@PathVariable String id, @RequestBody CommentCreationRequest creationRequest) 
    {
        try {
            Article article = this.articleService.findById(Integer.valueOf(id));
            if (article == null) {
                return ResponseEntity.notFound().build();
            }

            Comment comment = this.articleService.comment(Integer.valueOf(id), creationRequest);
            CommentDto dto = mapper.map(comment, CommentDto.class);
            CommentCreationResponse response = new CommentCreationResponse("Successfully added comment", dto);
            ResponseEntity<CommentCreationResponse> responseEntity = ResponseEntity.ok().body(response);
            return responseEntity;
        } 
        catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
