package com.aivle.bookapp.domain;

import jakarta.persistence.*;
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

public class CoverGeneration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long generationId;

    private Long bookId;

    private String imageModel;

    private String imageQuality;

    private String outputFormat;

    private String coverStyle;

    private String prompt;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime completedAt;
}