package com.aivle.bookapp.service;

import -----
import -----


@Service
@RequiredArgsConstructor


public class BookService{
    private final BookRepository bookRepository;

    // 전체 도서 목록 조회
    @Transactional(readOnly = true)
    public List<Book> getAllBooks(){

        return --
    }

    // 도서 조회
    @Transactional(readOnly = true)
    public Book getBookById(String id){

        return --

    }
    // 도서 등록
    public Book createBook(Book book){

        return--
    }

    //도서 수정
    public Book updateBook(String id, Book book){

        return --
    }

    //도서 삭제
    public void deleteBook(String id){

        return --
    }

    // 내 도서 목록 조회 - 마이페이지용
    @Transactional(readOnly = ture)
    public List<Book> getBookByUserId(String userId){

        return --
    }
}
