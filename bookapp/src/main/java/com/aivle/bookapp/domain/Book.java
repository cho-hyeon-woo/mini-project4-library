package com.aivle.bookapp.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

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

    @Column(columnDefinition = "TEXT")
    private String content;
    private String coverImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
//    private String genre;
    private String style;
    private String imageModel;
//    private String imageSize;
    private String imageQuality;
    private String outputFormat;

    // 외래키로 유저 ID
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}