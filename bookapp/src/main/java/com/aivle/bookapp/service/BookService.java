package com.aivle.bookapp.service;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.exception.BookNotFoundException;
import com.aivle.bookapp.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public Book findById(Long id) {
        return bookRepository.findById(id).orElseThrow(()
                -> new BookNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Transactional
    public void deleteBook(Long id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
        } else {
            throw new BookNotFoundException(id);
        }
    }

    @Transactional(readOnly = true)
    public long count() {
        return bookRepository.count();
    }

    @Transactional(readOnly = true)
    public List<Book> searchByTitle(String title) {
        return bookRepository.findByTitle(title);
    }

    @Transactional(readOnly = true)
    public List<Book> searchByKeyword(String keyword) {
        return bookRepository.findByTitleContaining(keyword);
    }

    @Transactional(readOnly = true)
    public List<Book> searchByTitleAndAuthor(String title, String author) {
        return bookRepository.findByTitleAndAuthor(title, author);
    }

    @Transactional(readOnly = true)
    public List<String> authorGetTitle(String author) {
        List<Book> books = bookRepository.findByAuthor(author);

        return books.stream().map(book -> book.getTitle()).toList();
    }

    @Transactional(readOnly = true)
    public Page<Book> getPage(int page, int size, String sortBy) {
        Sort sort = Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return bookRepository.findAll(pageable);
    }

    @Transactional
    public Book create(Book book) {
        return bookRepository.save(book);
    }

    @Transactional
    public Book update(Long id, Book book) {
        Book existing = findById(id);

        if (book.getTitle() != null) {
            existing.setTitle(book.getTitle());
        }
        if (book.getAuthor() != null) {
            existing.setAuthor(book.getAuthor());
        }
        if (book.getContent() != null) {
            existing.setContent(book.getContent());
        }
        if (book.getGenre() != null) {
            existing.setGenre(book.getGenre());
        }
        if (book.getStyle() != null) {
            existing.setStyle(book.getStyle());
        }
        if (book.getCoverImageUrl() != null) {
            existing.setCoverImageUrl(book.getCoverImageUrl());
        }
        if (book.getImageModel() != null) {
            existing.setImageModel(book.getImageModel());
        }
        if (book.getImageSize() != null) {
            existing.setImageSize(book.getImageSize());
        }
        if (book.getImageQuality() != null) {
            existing.setImageQuality(book.getImageQuality());
        }
        if (book.getOutputFormat() != null) {
            existing.setOutputFormat(book.getOutputFormat());
        }
        if (book.getCreatedAt() != null) {
            existing.setCreatedAt(book.getCreatedAt());
        }
        if (book.getUpdatedAt() != null) {
            existing.setUpdatedAt(book.getUpdatedAt());
        }

        return bookRepository.save(existing);
    }
}











