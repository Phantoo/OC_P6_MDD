package com.openclassrooms.mddapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.models.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {}
