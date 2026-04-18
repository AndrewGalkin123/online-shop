package com.andrii.nekon.repository;

import com.andrii.nekon.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    // Ищем корзину по пользователю.
    // У каждого пользователя ровно одна корзина (OneToOne в модели).
    Optional<Cart> findByUserId(Long userId);
}
