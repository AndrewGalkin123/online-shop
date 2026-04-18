package com.andrii.nekon.repository;

import com.andrii.nekon.model.CartItem;
import com.andrii.nekon.model.CartItemId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, CartItemId> {

    // Ищем конкретный товар в конкретной корзине.
    // Нужно чтобы при повторном добавлении увеличить количество,
    // а не создавать дубликат.
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    // Удаляем конкретный товар из корзины
    void deleteByCartIdAndProductId(Long cartId, Long productId);
}