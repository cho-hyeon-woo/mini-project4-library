package com.aivle.bookapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HelloController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
                "status", "Book API is running",
                "frontend", "http://localhost:5173",
                "booksApi", "http://localhost:8080/books"
        );
    }

    // "/hello" GetMapping
    /*@GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }*/

    @GetMapping("/hello/{name}")
    public String hello(@PathVariable String name) {
        return "Hello" + name + "!";
    }

    @GetMapping("/greet")
    public String greet(@RequestParam(defaultValue = "en") String lang) {
        if (lang.equals("ko")) {
            return "안녕하세요";
        }
        return "Hello";
    }
}
