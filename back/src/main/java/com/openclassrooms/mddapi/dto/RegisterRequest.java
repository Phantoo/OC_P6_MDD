package com.openclassrooms.mddapi.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest 
{
    String email;
    String username;
    String password;
}

