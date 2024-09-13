package com.openclassrooms.mddapi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.models.UserDetails;
import com.openclassrooms.mddapi.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService
{
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException 
    {
        User user = userRepository.findByEmail(username);
        if (user == null)
            throw new UsernameNotFoundException(username);

        return UserDetails
            .builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .password(user.getPassword())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .subjects(user.getSubjects())
            .build();
    }
}
