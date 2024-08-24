package com.openclassrooms.mddapi.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.repositories.ArticleRepository;

@Service
public class ArticleService 
{
    @Autowired
    private ArticleRepository articleRepository;

    public Article findById(Integer id) {
        return this.articleRepository.findById(id).orElse(null);
    }

    public List<Article> findAll() {
        return this.articleRepository.findAll();
    }
}
