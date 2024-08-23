package com.openclassrooms.mddapi.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.models.Subject;
import com.openclassrooms.mddapi.repositories.SubjectRepository;

@Service
public class SubjectService 
{
    @Autowired
    private SubjectRepository subjectRepository;

    public Subject findById(Integer id) {
        return this.subjectRepository.findById(id).orElse(null);
    }

    public List<Subject> findAll() {
        return this.subjectRepository.findAll();
    }
}