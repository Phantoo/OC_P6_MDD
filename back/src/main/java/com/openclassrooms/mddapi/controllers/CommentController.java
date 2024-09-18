package com.openclassrooms.mddapi.controllers;

import java.util.ArrayList;
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
import com.openclassrooms.mddapi.interfaces.CommentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.StringToClassMapItem;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("comments")
@AllArgsConstructor
public class CommentController 
{
    @Autowired
    private CommentService commentService;

    @Autowired
    private ModelMapper mapper;

    @GetMapping("/{id}")
    @Operation(description = "Fetch comment corresponding to the specified id", responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Fetch success", 
                    content = @Content(mediaType = "application/json", 
                        schema = @Schema(implementation = CommentDto.class))),
        @ApiResponse(responseCode = "400",
                    description = "ID not parsable as Integer",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404",
                    description = "Comment not found",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
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
    @Operation(description = "Fetch all comments", responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Fetch success", 
                    content = @Content(mediaType = "application/json", 
                        schema = @Schema(type = "object", properties = { @StringToClassMapItem(key = "comments", value = ArrayList.class) }))),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<List<CommentDto>> findAll() 
    {
        List<Comment> articles = this.commentService.findAll();
        List<CommentDto> dtos = mapper.map(articles, new TypeToken<List<CommentDto>>() {}.getType());
        return ResponseEntity.ok().body(dtos);
    }
}
