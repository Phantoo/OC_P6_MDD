package com.openclassrooms.mddapi.models.dto;

import java.util.Date;
import java.util.List;

import com.openclassrooms.mddapi.models.Subject;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto 
{
    private Integer id;

    private String username;

    private String email;

    private Date createdAt;

    private Date updatedAt;

    private List<Subject> subjects;
}
