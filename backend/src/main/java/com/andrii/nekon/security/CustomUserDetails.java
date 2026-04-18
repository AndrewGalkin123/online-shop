package com.andrii.nekon.security;

import com.andrii.nekon.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

// Spring Security не знает о нашем классе User.
// Он работает только с интерфейсом UserDetails.
// Этот класс — обёртка: берём нашего User и "переводим"
// его в формат который понимает Spring Security.
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails{
    // Наш User из базы данных
    private final User user;

    // Spring Security спрашивает: какие роли у этого пользователя?
    // Берём роли из нашей модели (ROLE_USER, ROLE_ADMIN...)
    // и превращаем в список объектов GrantedAuthority — это формат Spring
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // Аккаунт не заблокирован?
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // Пароль не просрочен?
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // Аккаунт активен?
    @Override
    public boolean isEnabled() {
        return true;
    }

    // Дополнительный метод — чтобы можно было получить id пользователя
    // из любого места где есть CustomUserDetails
    public Long getId() {
        return user.getId();
    }

}
