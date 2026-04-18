package com.andrii.nekon.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

// Этот класс отвечает на вопрос:
// "Что вернуть пользователю если он обратился к защищённому
//  endpoint без токена или с невалидным токеном?"
//
// Без него Spring вернул бы HTML страницу с ошибкой 401 —
// это неудобно для React фронтенда который ждёт JSON.
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint{

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException // причина ошибки
    ) throws IOException {

        // Ставим статус 401 Unauthorized
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // Говорим что возвращаем JSON
        response.setContentType("application/json");

        // Пишем JSON в тело ответа
        // Фронтенд получит: {"error": "Unauthorized", "message": "Please login first"}
        response.getWriter().write(
                "{\"error\": \"Unauthorized\"}"
        );
    }
}
