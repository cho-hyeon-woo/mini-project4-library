package com.aivle.bookapp;

import com.aivle.bookapp.domain.Book;
import com.aivle.bookapp.domain.User;
import com.aivle.bookapp.repository.BookRepository;
import com.aivle.bookapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaAuditing
public class BookappApplication {

	@Bean
	CommandLineRunner init(BookRepository bookRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			User u1 = new User();
			u1.setLoginId("aaa");
			u1.setName("aaa");
			u1.setPassword(passwordEncoder.encode("aaaa"));
			userRepository.save(u1);

			User u2 = new User();
			u2.setLoginId("test");
			u2.setName("test");
			u2.setPassword(passwordEncoder.encode("1234"));
			userRepository.save(u2);

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
			b1.setTitle("코믹 메이플 스토리 S 수학도둑 3 - 어둠의 길로 가는 문");
			b1.setAuthor("송도수, 여운방 (지은이), 서정 엔터테인먼트 (그림)");
			b1.setContent("2006년 첫 출간되어 2024년 100권으로 완결 후 누적 판매 900만 부를 기록한 &lt;수학도둑&gt;의 새로운 시작이다. ‘초능력’과 미스터리한 세계를 배경으로 한 모험 이야기와 초등 수학, 과학 콘텐츠를 함께 담았다.");
			b1.setCoverImageUrl("http://localhost:8080/uploads/covers/888ed6ee-94cc-424c-9b92-4251d615d0cb.png");
			b1.setGenre("실용서적");
			b1.setStyle("미니멀");
			b1.setUserId(1L);
			bookRepository.save(b1);

			Book b2 = new Book();
			b2.setTitle("코믹 메이플 스토리 S 수학도둑 3 - 어둠의 길로 가는 문");
			b2.setAuthor("송도수, 여운방 (지은이), 서정 엔터테인먼트 (그림)");
			b2.setContent("2006년 첫 출간되어 2024년 100권으로 완결 후 누적 판매 900만 부를 기록한 &lt;수학도둑&gt;의 새로운 시작이다. ‘초능력’과 미스터리한 세계를 배경으로 한 모험 이야기와 초등 수학, 과학 콘텐츠를 함께 담았다.");
			b2.setCoverImageUrl("http://localhost:8080/uploads/covers/ffc2503d-a30d-4da3-aa4d-501d632fb179.png");
			b2.setGenre("실용서적");
			b2.setStyle("미니멀");
			b2.setUserId(1L);
			bookRepository.save(b2);

			Book b3 = new Book();
			b3.setTitle("코믹 메이플 스토리 오프라인 RPG 46");
			b3.setAuthor("송도수 (글), 서정은 (그림)");
			b3.setContent("2004년 4월에 1권을 출간하여 지금까지, ‘8년 연속 초특급 베스트셀러’,  ‘1200만부 돌파’를 기록하며 독자들의 꾸준한 사랑을 받고 있는 아동 만화책이다. 각양각색 개성만점의 주인공들과 함께 모험을 떠나며 우정, 도전, 배려, 정의를 배우고 독창적인 이야기를 통해 마음껏 상상해보고 추론하는 과정에서는 어린이들의 상상력과 창의력이 향상된다.");
			b3.setCoverImageUrl("http://localhost:8080/uploads/covers/fb58aff0-9eff-4c1f-b520-591e4afaee99.png");
			b3.setGenre("소설");
			b3.setStyle("미니멀");
			b3.setUserId(2L);
			bookRepository.save(b3);

			Book b4 = new Book();
			b4.setTitle("나의 사랑아");
			b4.setAuthor("강패");
			b4.setContent("오랜 시간 견뎌온 참고마운 사람 잘해주지 못 해 미안해 나의 사랑아 나의 사랑아.");
			b4.setCoverImageUrl("http://localhost:8080/uploads/covers/a39b4528-2b9b-4eaf-9126-eb697bbf56c8.png");
			b4.setGenre("인문학");
			b4.setStyle("Photorealistic, real human photography style, highly detailed portrait, 8k resolution");
			b4.setUserId(2L);
			bookRepository.save(b4);

			Book b5 = new Book();
			b5.setTitle("멀티미디어 헐크버스터");
			b5.setAuthor("밀키밀리");
			b5.setContent("영웅이 없이 선택해도 좋다.\n임영웅이 되어 버리고 말 것이다.\n");
			b5.setCoverImageUrl("http://localhost:8080/uploads/covers/614dd0a5-a8f8-4fe4-8a4b-f7f0c801c8e9.png");
			b5.setGenre("실용서적");
			b5.setStyle("미니멀");
			b5.setUserId(2L);
			bookRepository.save(b5);
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(BookappApplication.class, args);
	}
}
