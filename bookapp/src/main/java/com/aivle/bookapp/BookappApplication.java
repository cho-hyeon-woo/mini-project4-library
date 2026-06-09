package com.aivle.bookapp;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BookappApplication {

	@Bean
	CommandLineRunner init(BookRepository bookRepository) {
		return args -> {
			// save, findById 예제 코드
			/*Book book = new Book();
			book.setTitle("Spring boot 입문");
			book.setAuthor("임한울");

			Book saved = bookRepository.save(book);

			System.out.println("책 id: " + saved.getId());

			Book book2 = bookRepository.findById(1L).orElseThrow(() -> new RuntimeException("책이 없음"));

			System.out.println("-------------------");
			System.out.println("book2의 id: " + book2.getId());
			System.out.println("book2의 title: " + book2.getTitle());
			System.out.println("book2의 author: " + book2.getAuthor());*/

			Book b1 = new Book();
			b1.setTitle("자바의 정석");
			b1.setAuthor("남궁성");
			bookRepository.save(b1);

			Book b2 = new Book();
			b2.setTitle("Spring 입문");
			b2.setAuthor("임한울");
			bookRepository.save(b2);

			Book b3 = new Book();
			b3.setTitle("React 시작");
			b3.setAuthor("홍길동");
			bookRepository.save(b3);

			Book b4 = new Book();
			b4.setTitle("자바의 기초");
			b4.setAuthor("임한울");
			bookRepository.save(b4);

			Book b5 = new Book();
			b5.setTitle("Node.js 실전");
			b5.setAuthor("김에이블");
			bookRepository.save(b5);
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(BookappApplication.class, args);
	}
}
