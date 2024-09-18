package com.openclassrooms.mddapi.controllers;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.models.Subject;
import com.openclassrooms.mddapi.models.dto.SubjectDto;
import com.openclassrooms.mddapi.interfaces.SubjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.StringToClassMapItem;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("subjects")
@AllArgsConstructor
public class SubjectController
{
    @Autowired
    private SubjectService subjectService;

    @Autowired
    private ModelMapper mapper;

    @GetMapping("/{id}")
    @Operation(description = "Fetch subject corresponding to the specified id", responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Fetch success", 
                    content = @Content(mediaType = "application/json", 
                        schema = @Schema(implementation = SubjectDto.class))),
        @ApiResponse(responseCode = "400",
                    description = "ID not parsable as Integer",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404",
                    description = "Subject not found",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<SubjectDto> findById(@PathVariable String id) 
    {
        try {
            Subject subject = this.subjectService.findById(Integer.valueOf(id));
            if (subject == null) {
                return ResponseEntity.notFound().build();
            }

            SubjectDto dto = mapper.map(subject, SubjectDto.class);
            return ResponseEntity.ok().body(dto);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    @Operation(description = "Fetch all subjects", responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Fetch success", 
                    content = @Content(mediaType = "application/json", 
                        schema = @Schema(type = "object", properties = { @StringToClassMapItem(key = "subjects", value = ArrayList.class) }))),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<List<SubjectDto>> findAll() 
    {
        List<Subject> subjects = this.subjectService.findAll();
        List<SubjectDto> dtos = mapper.map(subjects, new TypeToken<List<SubjectDto>>() {}.getType());
        return ResponseEntity.ok().body(dtos);
    }
    
}
