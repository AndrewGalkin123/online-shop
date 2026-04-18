package com.andrii.nekon.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

// Этот сервис отвечает за всё что связано с JWT токеном:
// 1. Создать токен после логина
// 2. Прочитать email из токена
// 3. Проверить что токен валидный
@Service
public class JwtService {

    // Берём секретный ключ из application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Берём время жизни токена из application.properties
    @Value("${jwt.expiration}")
    private long expiration;

    // Создаём криптографический ключ из нашей строки-секрета.
    // HMAC-SHA256 требует ключ в виде объекта SecretKey, не строки.
    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Генерируем JWT токен для пользователя.
    // Вызывается один раз — сразу после успешного логина.
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                // subject — главный идентификатор в токене, кладём email
                .subject(userDetails.getUsername())
                // когда токен выдан
                .issuedAt(new Date())
                // когда токен истекает: сейчас + 24 часа
                .expiration(new Date(System.currentTimeMillis() + expiration))
                // подписываем нашим секретным ключом
                // без этой подписи токен можно подделать
                .signWith(getKey())
                .compact(); // превращаем в строку вида eyJ...
    }

    // Достаём email из токена.
    // Вызывается при каждом запросе в JwtAuthenticationFilter.
    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(getKey())  // проверяем подпись нашим ключом
                .build()
                .parseSignedClaims(token) // парсим токен
                .getPayload()
                .getSubject();
    }

    // Проверяем что токен валидный:
    // 1. Email в токене совпадает с email пользователя в БД
    // 2. Токен не просрочен (проверяется автоматически при парсинге)
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String email = extractEmail(token);
            return email.equals(userDetails.getUsername());
        } catch (JwtException e) {
            // JwtException бросается если токен просрочен,
            // подпись неверна, или токен повреждён
            return false;
        }
    }

}
