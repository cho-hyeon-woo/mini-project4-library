package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.StarScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StarScoreRepository extends JpaRepository<StarScore, Long> {
    
    Optional<StarScore> findByUserIdAndBookId(Long userId, Long bookId);
    void deleteByUserId(Long userId);
    @Query("SELECT AVG(s.score) FROM StarScore s WHERE s.bookId = :bookId")
    Double getAverageScoreByBookId(@Param("bookId") Long bookId);
}