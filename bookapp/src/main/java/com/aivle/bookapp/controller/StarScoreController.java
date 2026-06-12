package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.StarScore;
import com.aivle.bookapp.service.StarScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stars")
@RequiredArgsConstructor
public class StarScoreController {

    private final StarScoreService starScoreService;

    @PostMapping("/rate")
    public ResponseEntity<StarScore> rateBook(
            @RequestParam Long userId,
            @RequestParam Long bookId,
            @RequestParam int score) {
        
        StarScore starScore = starScoreService.saveOrUpdateScore(userId, bookId, score);
        return ResponseEntity.ok(starScore);
    }

    @GetMapping("/book/{bookId}/average")
    public ResponseEntity<Integer> getAverageScore(@PathVariable Long bookId) {
        Double average = starScoreService.getAverageScore(bookId);
        int intAverage = average.intValue();
        return ResponseEntity.ok(intAverage);
    }
}