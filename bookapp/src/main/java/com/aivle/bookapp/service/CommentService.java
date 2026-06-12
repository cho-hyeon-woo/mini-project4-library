package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Comment;
import com.aivle.bookapp.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;

    public Comment addComment(Long userId, Long bookId, String content) {
        Comment newComment = new Comment();
        newComment.setUserId(userId);
        newComment.setBookId(bookId);
        newComment.setContent(content);
        
        return commentRepository.save(newComment);
    }

    @Transactional(readOnly = true) 
    public List<Comment> getCommentsByBookId(Long bookId) {
        return commentRepository.findByBookIdOrderByCreatedAtDesc(bookId);
    }

    public boolean deleteComment(Long commentId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        
        if (comment.isPresent()) {
            commentRepository.delete(comment.get());
            return true; 
        } else {
            return false; 
        }
    }
}