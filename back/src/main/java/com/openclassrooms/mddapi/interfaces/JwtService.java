package com.openclassrooms.mddapi.interfaces;

import org.springframework.security.core.Authentication;

public interface JwtService 
{
    public String generateToken(Authentication authentication);
    public String getUserNameFromJwtToken(String token);
    public boolean validateJwtToken(String token);
}
