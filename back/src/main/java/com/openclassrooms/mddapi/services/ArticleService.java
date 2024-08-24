package com.openclassrooms.mddapi.services;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.models.Comment;
import com.openclassrooms.mddapi.models.Subject;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.models.dto.ArticleCreationRequest;
import com.openclassrooms.mddapi.models.dto.CommentCreationRequest;
import com.openclassrooms.mddapi.repositories.ArticleRepository;

@Service
public class ArticleService 
{
    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private CommentService commentService;

    public Article findById(Integer id) {
        return this.articleRepository.findById(id).orElse(null);
    }

    public List<Article> findAll() {
        return this.articleRepository.findAll();
    }

    public Article add(ArticleCreationRequest creationRequest)
    {
        Article article = new Article();
        article.setTitle(creationRequest.getTitle());
        article.setContent(creationRequest.getContent());

        User author = this.userService.findById(creationRequest.getAuthorId());
        article.setAuthor(author);

        Subject subject = this.subjectService.findById(creationRequest.getSubjectId());
        article.setSubject(subject);

        Date now = new Date();
        article.setCreatedAt(new Timestamp(now.getTime()));

        article.setComments(new ArrayList<Comment>());

        Article savedArticle = articleRepository.save(article);
        return savedArticle;
    }

    public Comment comment(Integer articleId, CommentCreationRequest creationRequest)
    {
        Comment comment = new Comment();
        comment.setContent(creationRequest.getContent());

        User author = this.userService.findById(creationRequest.getAuthorId());
        comment.setAuthor(author);

        Article article = this.articleRepository.findById(articleId).get();
        comment.setArticle(article);

        Date now = new Date();
        comment.setCreatedAt(new Timestamp(now.getTime()));

        // Add comment to the article and save changes
        Comment savedComment = this.commentService.add(comment);
        // List<Comment> comments = article.getComments();
        // comments.add(comment);
        // article.setComments(comments);
        // Article savedArticle = articleRepository.save(article);
        // Comment savedComment = savedArticle.getComments().stream().filter(c -> {
        //     return c.getCreatedAt().equals(new Timestamp(now.getTime()));
        // }).findFirst().orElse(null);
        return savedComment;
    }
}
