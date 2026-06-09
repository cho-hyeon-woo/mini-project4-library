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
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    @NotBlank
    private String loginId;

    @Column(nullable = false)
    @NotBlank
    private String password;

    @Column(nullable = false)
    @NotBlank
    private String name;

    private LocalDateTime createdAt;
}