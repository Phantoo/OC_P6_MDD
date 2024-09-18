package com.openclassrooms.mddapi.interfaces;

import java.util.List;

import com.openclassrooms.mddapi.models.Subject;

public interface SubjectService 
{
    public Subject findById(Integer id);
    public List<Subject> findAll();
}
