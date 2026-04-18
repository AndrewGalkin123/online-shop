package com.andrii.nekon.security;

import com.andrii.nekon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// Spring Security при проверке JWT спрашивает:
// "Дай мне пользователя по email из токена."
// Этот сервис отвечает на этот вопрос.
// Мы имплементируем UserDetailsService — стандартный интерфейс Spring.
// Spring сам найдёт этот бин и будет его использовать автоматически.
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService{
    private final UserRepository userRepository;

    // Spring вызывает этот метод передавая username.
    // В нашем случае username = email пользователя.
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Ищем пользователя в БД по email
        // Если не нашли — бросаем исключение (Spring сам обработает)
        return userRepository.findByEmailWithRoles(email)
                .map(user -> new CustomUserDetails(user))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
