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
    
    private final BookService bookService;

    @PostMapping
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        Book saved = bookService.create(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable Long id) {
        Book book = bookService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(book);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Book>> getBooksByUserId(@PathVariable Long userId) {
        // Service 및 Repository에 findByUserId 메서드가 구현되어 있어야 합니다.
        List<Book> books = bookService.findByUserId(userId);
        return ResponseEntity.status(HttpStatus.OK).body(book);
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(bookService.findAll());
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Book>> getPage(
            @RequestParam int page, 
            @RequestParam int size, 
            @RequestParam(defaultValue = "id") String sortBy) {
        return ResponseEntity.ok(bookService.getPage(page, size, sortBy));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        Book updated = bookService.update(id, book);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
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

    @PostMapping("/books")
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        Book saved = bookService.create(book);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}













