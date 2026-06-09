package com.aivle.bookapp.domain;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


//@Table(name = "BOOK2")     // Table 어노테이션 테스트
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    @NotBlank
    private String title;

    @Column(nullable = false)
    @NotBlank
    private String author;

    @Column(length = 4000)
    private String content;

    private String genre;

    private String style;

    @Lob
    private String coverImageUrl;

    private String imageModel;

    private String imageSize;

    private String imageQuality;

    private String outputFormat;

    private String createdAt;

    private String updatedAt;
}
