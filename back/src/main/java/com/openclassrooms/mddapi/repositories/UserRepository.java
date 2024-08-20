package com.openclassrooms.mddapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openclassrooms.mddapi.models.User;

public interface UserRepository extends JpaRepository<User, Integer>
{
    public User findByUsername(String username);
    public User findByEmail(String email);
}
