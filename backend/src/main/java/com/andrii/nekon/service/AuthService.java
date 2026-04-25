package com.andrii.nekon.service;

import com.andrii.nekon.dto.AuthResponseDTO;
import com.andrii.nekon.dto.LoginRequestDTO;
import com.andrii.nekon.dto.RegisterRequestDTO;
import com.andrii.nekon.model.Role;
import com.andrii.nekon.model.User;
import com.andrii.nekon.repository.RoleRepository;
import com.andrii.nekon.repository.UserRepository;
import com.andrii.nekon.security.CustomUserDetails;
import com.andrii.nekon.security.CustomUserDetailsService;
import com.andrii.nekon.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // AuthenticationManager — стандартный компонент Spring Security.
    // Его задача: проверить логин+пароль используя UserDetailsService.
    // Сам найдёт пользователя и сравнит хешированный пароль.
    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public void register(RegisterRequestDTO request) {

        // Проверяем есть ли пользователь с таким email
        Optional<User> existingUser = userRepository.findByEmailIncludingInactive(request.getEmail());

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            if (Boolean.TRUE.equals(user.getIsActive())) {
                // Активный пользователь — нельзя зарегистрироваться
                throw new RuntimeException("Email already exists");
            } else {
                // Деактивированный — реактивируем с новыми данными
                user.setIsActive(true);
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setFirstName(request.getFirstName());
                user.setLastName(request.getLastName());
                user.setPhone(request.getPhone());
                userRepository.save(user);
                return;
            }
        }

        // Новый пользователь — регистрируем через процедуру
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

        userRepository.registerUser(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName(),
                request.getLastName(),
                request.getPhone(),
                userRole.getName()
        );

    }

    public AuthResponseDTO login(LoginRequestDTO request) {

        // Передаём email и пароль в AuthenticationManager.
        // Он сам:
        // 1. Вызовет CustomUserDetailsService.loadUserByUsername(email)
        // 2. Сравнит введённый пароль с хешем из БД через BCrypt
        // 3. Если неверно — бросит BadCredentialsException (Spring сам вернёт 401)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        // Если дошли сюда — логин+пароль верные.
        // Загружаем пользователя для генерации токена.
        CustomUserDetails userDetails =
                (CustomUserDetails) userDetailsService.loadUserByUsername(request.getEmail());

        // Генерируем JWT токен для этого пользователя
        String token = jwtService.generateToken(userDetails);

        // Загружаем User чтобы достать firstName для ответа
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName())
                .orElse("ROLE_USER");

        // Возвращаем токен + базовую инфу о пользователе
        return new AuthResponseDTO(token, user.getEmail(), user.getFirstName(), user.getLastName(), user.getPhone(),role);

    }
}
