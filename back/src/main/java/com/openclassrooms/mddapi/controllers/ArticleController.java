package com.openclassrooms.mddapi.controllers;

import java.util.List;

import org.modelmapper.ModelMapper;
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
import com.openclassrooms.mddapi.interfaces.ArticleService;

import io.micrometer.common.util.StringUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("articles")
@AllArgsConstructor
public class ArticleController 
{
    @Autowired
    private ArticleService articleService;

    @Autowired
    private ModelMapper mapper;

    @GetMapping("/{id}")
    @Operation(description = "Fetch atricle corresponding to the specified id", responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Fetch success", 
                    content = @Content(mediaType = "application/json", 
                        schema = @Schema(implementation = ArticleDto.class))),
        @ApiResponse(responseCode = "400",
                    description = "ID not parsable as Integer",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404",
                    description = "Article not found",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
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
    @Operation(description = "Fetch articles corresponding to the specified page and subjects", responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Fetch success", 
                    content = @Content(mediaType = "application/json", 
                        schema = @Schema(implementation = Page.class))),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<Page<ArticleDto>> findAll(@RequestParam(required = false) List<Integer> subjects, Pageable pageable) 
    {
        Page<Article> articles = this.articleService.findAll(subjects, pageable);
        Page<ArticleDto> dtos = articles.map(article -> {
            return mapper.map(article, ArticleDto.class);
        });
        return ResponseEntity.ok().body(dtos);
    }

    @PostMapping
    @Operation(description = "Create article", responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Creation success", 
                    content = @Content(mediaType = "application/json", 
                        schema = @Schema(implementation = ArticleCreationResponse.class))),
        @ApiResponse(responseCode = "400",
                    description = "One or more fields are empty",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
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
    @Operation(responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Comment article corresponding to the specified id", 
                    content = @Content(mediaType = "application/json", 
                        schema = @Schema(implementation = CommentCreationRequest.class))),
        @ApiResponse(responseCode = "400",
                    description = "ID not parsable as Integer",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404",
                    description = "Article not found",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
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
