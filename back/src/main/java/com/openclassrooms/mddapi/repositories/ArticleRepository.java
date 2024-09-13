package com.openclassrooms.mddapi.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.models.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> 
{
    Page<Article> findBySubjectIdIn(List<Integer> subjectIds, Pageable pageable);
}
