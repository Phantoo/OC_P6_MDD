package com.openclassrooms.mddapi.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.interfaces.CommentService;
import com.openclassrooms.mddapi.models.Comment;
import com.openclassrooms.mddapi.repositories.CommentRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CommentServiceImpl implements CommentService
{
    @Autowired
    private CommentRepository commentRepository;

    public Comment findById(Integer id) {
        return this.commentRepository.findById(id).orElse(null);
    }

    public List<Comment> findAll() {
        return this.commentRepository.findAll();
    }

    public Comment add(Comment comment) {
        return this.commentRepository.save(comment);
    }
}
