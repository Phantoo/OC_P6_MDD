package com.openclassrooms.mddapi.controllers;

import org.apache.coyote.BadRequestException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.models.Subject;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.models.dto.UserDto;
import com.openclassrooms.mddapi.models.dto.UserUpdateRequest;
import com.openclassrooms.mddapi.services.SubjectService;
import com.openclassrooms.mddapi.services.UserService;

import jakarta.transaction.Transactional;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("users")
public class UserController 
{
    @Autowired
    private UserService userService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private ModelMapper mapper;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable String id) 
    {
        try {
            User user = this.userService.findById(Integer.valueOf(id));
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            //List<Subject> subjects = user.getSubjects();

            UserDto dto = mapper.map(user, UserDto.class);
            return ResponseEntity.ok().body(dto);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable String id, @RequestBody UserUpdateRequest updateRequest) 
    {
        try {
            User user = this.userService.findById(Integer.valueOf(id));
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            user = this.userService.update(user, updateRequest);

            UserDto dto = mapper.map(user, UserDto.class);
            return ResponseEntity.ok().body(dto);
        } 
        catch (NumberFormatException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("{userId}/subscribe/{subjectId}")
    @Transactional
    public ResponseEntity<?> subscribe(@PathVariable String userId, @PathVariable String subjectId) 
    {
        try {
            User user = this.userService.findById(Integer.valueOf(userId));
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Subject subject = this.subjectService.findById(Integer.valueOf(subjectId));
            if (subject == null) {
                return ResponseEntity.notFound().build();
            }

            user = this.userService.subscribe(user, subject);
            return ResponseEntity.ok().build();
        } 
        catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
        catch (BadRequestException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("{userId}/unsubscribe/{subjectId}")
    @Transactional
    public ResponseEntity<?> unsubscribe(@PathVariable String userId, @PathVariable String subjectId) 
    {
        try {
            User user = this.userService.findById(Integer.valueOf(userId));
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Subject subject = this.subjectService.findById(Integer.valueOf(subjectId));
            if (subject == null) {
                return ResponseEntity.notFound().build();
            }

            user = this.userService.unsubscribe(user, subject);
            return ResponseEntity.ok().build();
        } 
        catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
        catch (BadRequestException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
