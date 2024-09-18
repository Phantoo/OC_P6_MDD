package com.openclassrooms.mddapi.interfaces;

import java.util.List;

import com.openclassrooms.mddapi.models.Comment;

public interface CommentService 
{
    public Comment findById(Integer id);
    public List<Comment> findAll();
    public Comment add(Comment comment);
}
