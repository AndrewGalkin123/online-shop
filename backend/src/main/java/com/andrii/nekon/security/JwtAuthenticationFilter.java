package com.andrii.nekon.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Этот фильтр запускается при КАЖДОМ входящем HTTP запросе.
// Его задача: проверить есть ли JWT токен в заголовке запроса.
// Если есть и валиден — сообщить Spring Security кто делает запрос.
//
// OncePerRequestFilter гарантирует что фильтр выполнится
// ровно один раз на запрос (не дважды при forward/redirect).
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,   // входящий запрос
            @NonNull HttpServletResponse response, // исходящий ответ
            @NonNull FilterChain filterChain       // цепочка следующих фильтров
    ) throws ServletException, IOException {
        // Смотрим заголовок Authorization
        // Он должен выглядеть так: "Bearer eyJhbGciOiJIUzI1NiJ9..."
        String authHeader = request.getHeader("Authorization");

        // Если заголовка нет или он не начинается с "Bearer " —
        // токена нет, пропускаем запрос дальше без аутентификации.
        // Spring Security сам решит: можно ли этот endpoint без логина.

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Вырезаем сам токен: убираем "Bearer " (7 символов) из начала
        String token = authHeader.substring(7);

        // Достаём email из токена
        String email = jwtService.extractEmail(token);

        // Проверяем два условия:
        // 1. email удалось извлечь (токен не повреждён)
        // 2. пользователь ещё не аутентифицирован в этом запросе
        if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Загружаем пользователя из БД по email
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // Проверяем что токен валидный для этого пользователя
            if (jwtService.isTokenValid(token, userDetails)) {

                // Создаём объект аутентификации для Spring Security.
                // Первый параметр — кто пользователь (UserDetails)
                // Второй — credentials (пароль), нам не нужен, ставим null
                // Третий — список ролей
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // Добавляем детали запроса (IP адрес и т.д.)
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Говорим Spring Security: "вот кто делает этот запрос"
                // После этой строки Spring знает что пользователь аутентифицирован
                SecurityContextHolder.getContext().setAuthentication(auth);
            }

        }
        // Передаём запрос следующему фильтру в цепочке
        filterChain.doFilter(request, response);
    }
}
