package com.andrii.nekon.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Это то что вернём фронтенду после успешного логина.
// Фронтенд сохранит token (например в localStorage)
// и будет посылать его в каждом запросе.
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private String token;      // JWT токен — главное
    private String email;      // для отображения в UI
    private String firstName;  // для приветствия "Привет, Andrii!"
    private String lastName;
    private String phone;
    private String role; // ROLE_USER, ROLE_MANAGER, ROLE_ADMIN
}