package com.openclassrooms.mddapi.services;

import java.sql.Timestamp;
import java.util.Date;

import javax.naming.AuthenticationException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.models.UserDetails;
import com.openclassrooms.mddapi.models.dto.LoginRequest;
import com.openclassrooms.mddapi.models.dto.RegisterRequest;
import com.openclassrooms.mddapi.repositories.UserRepository;

@Service
public class UserService 
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Authentication login(LoginRequest loginRequest) throws AuthenticationException
    {
        Boolean loginValid = isUserValid(loginRequest.getEmail(), loginRequest.getPassword());
        if (loginValid == false)
            throw new AuthenticationException();

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(), userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
        return auth;
    }

    public User register(RegisterRequest registerRequest) throws AuthenticationException
    {
        // Is Username Unique
        if (usernameExists(registerRequest.getUsername()))
            throw new AuthenticationException();

        // Is Email Unique
        if (emailExists(registerRequest.getEmail()))
            throw new AuthenticationException();

        // Create
        User user = modelMapper.map(registerRequest, User.class);

        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
        user.setPassword(encodedPassword);

        Date now = new Date();
        user.setCreatedAt(new Timestamp(now.getTime()));
        user.setUpdatedAt(new Timestamp(now.getTime()));

        // Save
        User savedUser = userRepository.save(user);
        return savedUser;
    }

    public User findById(Integer id) {
        return this.userRepository.findById(id).orElse(null);
    }

    // Returns true only if the username/password matches an existing account
    private Boolean isUserValid(String email, String password)
    {
        UserDetails userDetails;
        try {
            userDetails = userDetailsService.loadUserByUsername(email);
        } 
        catch (UsernameNotFoundException e) {
            return false;
        }

        return passwordEncoder.matches(password, userDetails.getPassword());
    }
    
    private Boolean usernameExists(String username)
    {
        User foundUser = userRepository.findByUsername(username);
        return foundUser != null;
    }

    private Boolean emailExists(String email)
    {
        User foundUser = userRepository.findByEmail(email);
        return foundUser != null;
    }
}
