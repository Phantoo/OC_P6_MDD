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

import com.openclassrooms.mddapi.models.Comment;
import com.openclassrooms.mddapi.models.dto.CommentDto;
import com.openclassrooms.mddapi.services.CommentService;

@RestController
@RequestMapping("comments")
public class CommentController 
{
    @Autowired
    private CommentService commentService;

    @Autowired
    private ModelMapper mapper;

    @GetMapping("/{id}")
    public ResponseEntity<CommentDto> findById(@PathVariable String id) 
    {
        try {
            Comment comment = this.commentService.findById(Integer.valueOf(id));
            if (comment == null) {
                return ResponseEntity.notFound().build();
            }

            CommentDto dto = mapper.map(comment, CommentDto.class);
            return ResponseEntity.ok().body(dto);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<CommentDto>> findAll() 
    {
        List<Comment> articles = this.commentService.findAll();
        List<CommentDto> dtos = mapper.map(articles, new TypeToken<List<CommentDto>>() {}.getType());
        return ResponseEntity.ok().body(dtos);
    }
}
