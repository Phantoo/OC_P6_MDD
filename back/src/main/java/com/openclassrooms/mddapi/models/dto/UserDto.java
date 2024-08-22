package com.openclassrooms.mddapi.models.dto;

import java.util.Date;

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
}
