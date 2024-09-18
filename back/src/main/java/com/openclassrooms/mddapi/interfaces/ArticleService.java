package com.openclassrooms.mddapi.interfaces;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.models.Comment;
import com.openclassrooms.mddapi.models.dto.ArticleCreationRequest;
import com.openclassrooms.mddapi.models.dto.CommentCreationRequest;

public interface ArticleService 
{
    public Article findById(Integer id);
    public List<Article> findAll();
    public Page<Article> findAll(Pageable pageable);
    public Page<Article> findAll(List<Integer> subjectIds, Pageable pageable);
    public Article add(ArticleCreationRequest creationRequest);
    public Comment comment(Integer articleId, CommentCreationRequest creationRequest);
}
