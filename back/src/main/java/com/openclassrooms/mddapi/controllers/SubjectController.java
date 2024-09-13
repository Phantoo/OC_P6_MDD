package com.openclassrooms.mddapi.controllers;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.models.Subject;
import com.openclassrooms.mddapi.models.dto.SubjectDto;
import com.openclassrooms.mddapi.services.SubjectService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("subjects")
public class SubjectController
{
    @Autowired
    private SubjectService subjectService;

    @Autowired
    private ModelMapper mapper;

    @GetMapping("/{id}")
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
    public ResponseEntity<List<SubjectDto>> findAll() 
    {
        List<Subject> subjects = this.subjectService.findAll();
        List<SubjectDto> dtos = mapper.map(subjects, new TypeToken<List<SubjectDto>>() {}.getType());
        return ResponseEntity.ok().body(dtos);
    }
    
}
