
package com.aivle.bookapp.service;


import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor

public class UserService{

    private final UserRepository userRepository;

    //회원가입
    public User register(User user){
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    //로그인
    @Transactional(readOnly = true)
    public User login(String loginId, String password){
        return userRepository.findByLoginIdAndPassword(loginId, password)
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다."));
    }

    //회원 정보 조회
    @Transactional(readOnly = true)
    public User getUserById(String userId){
        return userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found" + userId));
    }

    // 회원 정보 수정
    public User updateUer(String userId, User user){
        User existing = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found" + userId));
        existing.setName(user.getName());
        existing.setPassword(user.getPassword());
        return userRepository.save(existing);
    }

    // 회원 탈퇴
    public void deleteUser(String userId){
        userRepository.deleteById(Long.parseLong(userId));
    }
}