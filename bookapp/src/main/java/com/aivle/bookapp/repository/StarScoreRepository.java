package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.StarScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StarScoreRepository extends JpaRepository<StarScore, Long> {
    
    // 유저가 이미 해당 책에 별점을 남겼는지 조회 (수정이나 중복 체크용)
    Optional<StarScore> findByUserIdAndBookId(Long userId, Long bookId);

    // 💡 핵심: 특정 책의 평균 별점 구하기 (소수점 자리가 나올 수 있으므로 Double 반환)
    // 만약 별점이 하나도 없다면 null이 반환되므로 Double(객체 타입)을 씁니다.
    @Query("SELECT AVG(s.score) FROM StarScore s WHERE s.bookId = :bookId")
    Double getAverageScoreByBookId(@Param("bookId") Long bookId);
}