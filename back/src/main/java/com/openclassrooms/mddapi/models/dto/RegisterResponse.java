package com.openclassrooms.mddapi.models.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RegisterResponse
{
    UserDto user;
    String token;
}
