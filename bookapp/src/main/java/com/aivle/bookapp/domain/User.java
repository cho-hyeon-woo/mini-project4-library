package com.aivle.bookapp.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;

    @Column(name = "login_id", nullable = false, unique = true)
    @NotBlank
    private String loginId;

    @Column(nullable = false)
    @NotBlank
    private String password;

    @Column(nullable = false)
    @NotBlank
    private String name;
}