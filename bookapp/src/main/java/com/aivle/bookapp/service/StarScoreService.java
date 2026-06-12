package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.StarScore;
import com.aivle.bookapp.repository.StarScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class StarScoreService {

    private final StarScoreRepository starScoreRepository;

    public StarScore saveOrUpdateScore(Long userId, Long bookId, int score) {
        Optional<StarScore> existingScore = starScoreRepository.findByUserIdAndBookId(userId, bookId);

        if (existingScore.isPresent()) {
            StarScore starScore = existingScore.get();
            starScore.setScore(score);
            return starScore; 
        } else {
            StarScore newStar = new StarScore();
            newStar.setUserId(userId);
            newStar.setBookId(bookId);
            newStar.setScore(score);
            return starScoreRepository.save(newStar);
        }
    }

    @Transactional(readOnly = true)
    public Double getAverageScore(Long bookId) {
        Double avg = starScoreRepository.getAverageScoreByBookId(bookId);
        return (avg != null) ? avg : 0.0;
    }
}