package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.Comment;
import com.aivle.bookapp.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/add")
    public ResponseEntity<Comment> addComment(
            @RequestParam Long userId,
            @RequestParam Long bookId,
            @RequestParam String content) {
        
        Comment createdComment = commentService.addComment(userId, bookId, content);
        return ResponseEntity.ok(createdComment);
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Comment>> getCommentsByBookId(@PathVariable Long bookId) {
        List<Comment> comments = commentService.getCommentsByBookId(bookId);
        return ResponseEntity.ok(comments);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        boolean isDeleted = commentService.deleteComment(commentId);
        
        if (isDeleted) {
            return ResponseEntity.ok("댓글이 성공적으로 삭제되었습니다.");
        } else {
            return ResponseEntity.status(404).body("존재하지 않는 댓글이거나 이미 삭제되었습니다.");
        }
    }
}