package com.openclassrooms.mddapi.interfaces;

import javax.naming.AuthenticationException;

import org.apache.coyote.BadRequestException;
import org.springframework.security.core.Authentication;

import com.openclassrooms.mddapi.models.Subject;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.models.dto.LoginRequest;
import com.openclassrooms.mddapi.models.dto.RegisterRequest;
import com.openclassrooms.mddapi.models.dto.UserUpdateRequest;

public interface UserService 
{
    public Authentication login(LoginRequest loginRequest) throws AuthenticationException;
    public User register(RegisterRequest registerRequest) throws AuthenticationException;
    public User findById(Integer id);
    public User update(User user, UserUpdateRequest updateRequest);
    public User subscribe(User user, Subject subject) throws BadRequestException;
    public User unsubscribe(User user, Subject subject) throws BadRequestException;
}
