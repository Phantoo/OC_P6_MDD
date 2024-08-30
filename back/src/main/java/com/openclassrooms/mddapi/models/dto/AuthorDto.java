package com.openclassrooms.mddapi.models.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Author is the same as a User but with less data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthorDto 
{
    private Integer id;

    private String username;
}
