package com.aivle.bookapp.controller;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.repository.BookRepository;
import com.aivle.bookapp.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookController {
    // 하드코딩 getBook
    /*@GetMapping("/books/1")
    public Book getBook() {
        return new Book(1L, "Spring Boot 입문", "임한울");
    }*/

    private final BookService bookService;

    @GetMapping("/books/{id}")
    public Book getBook(@PathVariable Long id) {
        return bookService.findById(id);
    }

    @GetMapping("/books")
    public List<Book> getAll() {
        return bookService.findAll();
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/books/count")
    public long getCount() {
        return bookService.count();
    }

    @GetMapping("/books/search/title")
    public List<Book> searchByTitle(@RequestParam String title) {
        return bookService.searchByTitle(title);
    }

    /*@GetMapping("/books/search/author")
    public List<Book> searchByAuthor(@RequestParam String author) {
        return bookRepository.findByAuthor(author);
    }*/

    @GetMapping("/books/search")
    public List<Book> searchByKeyword(@RequestParam String keyword) {
        return bookService.searchByKeyword(keyword);
    }

    @GetMapping("/books/search/detail")
    public List<Book> searchByTitleAndAuthor(@RequestParam String title, @RequestParam String author) {
        return bookService.searchByTitleAndAuthor(title, author);
    }

    @GetMapping("/books/search/author")
    public List<String> authorGetTitle(@RequestParam String author) {
        return bookService.authorGetTitle(author);
    }

    @GetMapping("/books/page")
    public Page<Book> getPage(@RequestParam int page, @RequestParam int size, @RequestParam String sortBy) {
        return bookService.getPage(page, size, sortBy);
    }

    @PostMapping("/books")
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        Book saved = bookService.create(book);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @RequestMapping(value = "/books/{id}", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        return bookService.update(id, book);
    }
}













