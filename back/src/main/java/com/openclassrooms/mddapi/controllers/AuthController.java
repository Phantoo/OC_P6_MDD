package com.openclassrooms.mddapi.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.dto.LoginResponse;
import com.openclassrooms.mddapi.dto.RegisterRequest;
import com.openclassrooms.mddapi.dto.RegisterResponse;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.services.JWTService;
import com.openclassrooms.mddapi.services.UserService;

import io.micrometer.common.util.StringUtils;

import javax.naming.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("auth")
public class AuthController 
{
    @Autowired
    private UserService userService;

    @Autowired
    private JWTService jwtService;

    @PostMapping("login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) 
    {
        // Try logging the user in        
        Authentication authentication = null;
        Boolean thrownException = false;
        try {
            authentication = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        }
        catch (AuthenticationException e) {
            thrownException = true;
        }

        // Return UNAUTHORIZED in case of an error during the authentication
        if (thrownException || 
            authentication == null || 
            authentication.isAuthenticated() == false)
        {
            LoginResponse response = new LoginResponse("Error during authentication", "");
            return ResponseEntity.status(401).body(response);
        }

        // Generate token and return success
        String token = jwtService.generateToken(authentication);
        LoginResponse response = new LoginResponse("User logged in successfully", token);
        return ResponseEntity.ok(response);        
    }
    
    @PostMapping("register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) 
    {
        if (StringUtils.isBlank(registerRequest.getUsername()) ||
            StringUtils.isBlank(registerRequest.getEmail()) ||
            StringUtils.isBlank(registerRequest.getPassword())) 
        {
            RegisterResponse response = new RegisterResponse("One or more empty fields", "");
            return ResponseEntity.badRequest().body(response);
        }

        // Try registering the user
        User user = null;
        Boolean registrationException = false;
        try {
            user = userService.register(registerRequest);
        }
        catch(AuthenticationException e) {
            registrationException = true;
        }

        if (user == null ||
            registrationException)
        {
            RegisterResponse response = new RegisterResponse("Error during account registration", "");
            return ResponseEntity.badRequest().body(response);
        }

        // Authenticate the newly registered user so we can generate and return the token
        Authentication authentication = null;
        Boolean loginException = false;
        try {
            authentication = userService.login(registerRequest.getEmail(), registerRequest.getPassword());
        }
        catch (AuthenticationException e) {
            loginException = true;
        }

        if (loginException ||
            authentication == null ||
            authentication.isAuthenticated() == false)
        {
            RegisterResponse response = new RegisterResponse("Error during authentication", "");
            return ResponseEntity.badRequest().body(response);
        }

        // Generate token and return success
        String token = jwtService.generateToken(authentication);
        RegisterResponse response = new RegisterResponse("User registered successfully", token);
        return ResponseEntity.ok(response);
    }
}
