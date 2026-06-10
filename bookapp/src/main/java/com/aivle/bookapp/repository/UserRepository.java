package com.aivle.bookapp.repository;

import com.aivle.bookapp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLoginIdAndPassword(String loginId, String password);   //UserService - findByLoginIdAndPassword 위한 선언
    List<User> findByLoginId(String loginId);
}