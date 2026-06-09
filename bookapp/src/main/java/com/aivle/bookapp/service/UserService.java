
package com.aivle.bookapp.service;

import---
import----

@Service
@RequiredArgsConstructor

public class UserService{

    private final UserRepository userRepository;

    //회원가입
    public User register(User user){

        return
    }

    //로그인
    public User login(String longinId, String password){

        return
    }

    //회원 정보 조회
    @Transactional(readOnly = true)
    public User getUserById(String userId){

        return
    }

    // 회원 정보 수정
    public User updateUer(String userId, User user){

        return
    }

    // 회원 탈퇴
    public void deleteUser(String userId){

    }
}