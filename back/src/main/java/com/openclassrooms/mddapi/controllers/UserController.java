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
import com.openclassrooms.mddapi.interfaces.SubjectService;
import com.openclassrooms.mddapi.interfaces.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("users")
@AllArgsConstructor
public class UserController 
{
    @Autowired
    private UserService userService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private ModelMapper mapper;

    @GetMapping("/{id}")
    @Operation(description = "Fetch user corresponding to the specified id", responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Fetch success", 
                    content = @Content(mediaType = "application/json", 
                        schema = @Schema(implementation = UserDto.class))),
        @ApiResponse(responseCode = "400",
                    description = "ID not parsable as Integer",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404",
                    description = "User not found",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<UserDto> findById(@PathVariable String id) 
    {
        try {
            User user = this.userService.findById(Integer.valueOf(id));
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            UserDto dto = mapper.map(user, UserDto.class);
            return ResponseEntity.ok().body(dto);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(description = "Update user corresponding to the specified id", responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Update success", 
                    content = @Content(mediaType = "application/json", 
                        schema = @Schema(implementation = UserDto.class))),
        @ApiResponse(responseCode = "400",
                    description = "ID not parsable as Integer",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404",
                    description = "User not found",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
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
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("{userId}/subscribe/{subjectId}")
    @Transactional
    @Operation(description = "Subscribe user corresponding to the specified id to the specified subject", responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Subscribe success", 
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "400",
                    description = "ID not parsable as Integer",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404",
                    description = "Subject or User not found",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
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
    @Operation(description = "Unsubscribe user corresponding to the specified id to the specified subject", responses = {
        @ApiResponse(responseCode = "200", 
                    description = "Unsubscribe success", 
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "400",
                    description = "ID not parsable as Integer",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404",
                    description = "Subject or User not found",
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "401",
                    description = "Authentication failure",
                    content = @Content(mediaType = "application/json"))
    })
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
