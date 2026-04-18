package com.andrii.nekon.config;

import com.andrii.nekon.security.JwtAuthenticationEntryPoint;
import com.andrii.nekon.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
// Включаем @PreAuthorize аннотации — пригодится для ролей (TASK 6)
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // Наш JWT фильтр — будем добавлять в цепочку фильтров
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Наш обработчик ошибок аутентификации
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager нужен в AuthService для проверки логина/пароля.
    // Spring сам создаёт его — мы просто "вытаскиваем" бин.
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                // Отключаем CSRF — не нужен для REST API с JWT
                // (CSRF актуален только для сессий с cookie)
                .csrf(csrf -> csrf.disable())

                // Говорим Spring: не создавай сессии.
                // Каждый запрос аутентифицируется через JWT независимо.
                .sessionManagement(s -> s
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Что делать при ошибке аутентификации — использовать наш EntryPoint
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )

                // Правила доступа к endpoint-ам
                .authorizeHttpRequests(auth -> auth

                        // Публичные — логин и регистрация, без токена
                        .requestMatchers("/api/auth/**").permitAll()

                        // Публичные — просмотр продуктов и категорий
                        .requestMatchers("/api/products/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()

                        .requestMatchers("/api/reviews/product/**").permitAll()

                        // Только авторизованные пользователи
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/reviews/**").authenticated()

                        .requestMatchers("/api/users/me").authenticated()
                        .requestMatchers("/api/admin/users/**").hasAnyRole("ADMIN", "MANAGER")

                        // Только ADMIN (hasRole автоматически добавляет ROLE_ префикс)
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // MANAGER и ADMIN
                        .requestMatchers("/api/manager/**").hasAnyRole("MANAGER", "ADMIN")


                        // Всё остальное — открыто (можно потом поменять на denyAll)
                        .anyRequest().permitAll()
                )

                // Добавляем наш JWT фильтр ПЕРЕД стандартным фильтром логина.
                // Порядок важен: сначала проверяем JWT, потом остальное.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}