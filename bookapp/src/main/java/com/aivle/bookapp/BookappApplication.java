package com.aivle.bookapp;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.repository.BookRepository;
import com.aivle.bookapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
@EnableJpaAuditing
public class BookappApplication {

	// 💡 괄호 안에 UserRepository 도 함께 주입받도록 수정합니다.
	@Bean
	CommandLineRunner init(BookRepository bookRepository, UserRepository userRepository) {
		return args -> {

			// 1. 샘플 유저 생성 및 저장 (JSON 데이터 기준)
			User user1 = new User("u001", "test", "1234", "테스트유저");
			User user2 = new User("u002", "qwer", "1234", "aaaaa");

			userRepository.save(user1);
			userRepository.save(user2);

			// 2. 샘플 책 생성 및 저장 (유저 정보 연동)
			Book b1 = new Book();
			b1.setTitle("NEO SEOUL 2076: 신기루");
			b1.setAuthor("KIM");
			b1.setContent("인공지능과 신체 개조가 일상이 된 시대, 가상 현실 속에 숨겨진 거대한 해킹 프로젝트의 서막.");
//			b1.setGenre("판타지/SF");
			b1.setStyle("테크웨어/글리치");
			b1.setImageModel("midjourney-v6");
//			b1.setImageSize("1024x1536");
			b1.setImageQuality("high");
			b1.setOutputFormat("png");
			b1.setCoverImageUrl("아직미정");
			b1.setCreatedAt(LocalDateTime.now());
			b1.setUpdatedAt(LocalDateTime.now());
			b1.setUser(user2);
			bookRepository.save(b1);

			Book b2 = new Book();
			b2.setTitle("Spring 입문");
			b2.setAuthor("임한울");
			b2.setContent("스프링 부트 입문용 책입니다.");
			b2.setStyle("미니멀");
			b2.setImageModel("gpt-image-2");
			b2.setImageQuality("low");
			b2.setOutputFormat("png");
			b2.setCoverImageUrl("아직미정");
			b2.setCreatedAt(LocalDateTime.now());
			b2.setUpdatedAt(LocalDateTime.now());
			b2.setUser(user2);
//			b2.setGenre("실용서적");
//			b2.setImageSize("1024x1536");
			bookRepository.save(b2);

			Book b3 = new Book();
			b3.setTitle("QA");
			b3.setAuthor("오승헌");
			b3.setContent("너 게임 개못해");
//			b3.setGenre("실용서적");
			b3.setStyle("미니멀");
			b3.setImageModel("gpt-image-2");
//			b3.setImageSize("1024x1536");
			b3.setImageQuality("low");
			b3.setOutputFormat("png");
			b3.setCoverImageUrl("아직미정");
			b3.setCreatedAt(LocalDateTime.now());
			b3.setUpdatedAt(LocalDateTime.now());
			b3.setUser(user1);
			bookRepository.save(b3);

			Book b4 = new Book();
			b4.setTitle("ㅁㄴㅇ");
			b4.setAuthor("ㅁㄴㅇ");
			b4.setContent("ㅁㄴㅇ");
//			b4.setGenre("실용서적");
			b4.setStyle("미니멀");
			b4.setImageModel("gpt-image-2");
//			b4.setImageSize("1024x1536");
			b4.setImageQuality("low");
			b4.setOutputFormat("png");
			b4.setCoverImageUrl("아직미정");
			b4.setCreatedAt(LocalDateTime.now());
			b4.setUpdatedAt(LocalDateTime.now());
			b4.setUser(user2);
			bookRepository.save(b4);


			Book b5 = new Book();
			b5.setTitle("사이버펑크2077: 엣지러너");
			b5.setAuthor("오승헌");
			b5.setContent("근미래, 인간성을 상실한 시대의 고도화된 과학 발전으로 인해 발생하는 액션 SF");
//			b5.setGenre("판타지/SF");
			b5.setStyle("사이버펑크");
			b5.setImageModel("gpt-image-2");
//			b5.setImageSize("1024x1024");
			b5.setImageQuality("medium");
			b5.setOutputFormat("png");
			b5.setCoverImageUrl("아직미정");
			b5.setCreatedAt(LocalDateTime.parse("2026-05-26T03:51:51"));
			b5.setUpdatedAt(LocalDateTime.parse("2026-05-26T03:51:51"));
			b5.setUser(user1);
			bookRepository.save(b5);


		};
	}

	public static void main(String[] args) {
		SpringApplication.run(BookappApplication.class, args);
	}
}