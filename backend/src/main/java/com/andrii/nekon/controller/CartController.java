package com.andrii.nekon.controller;

import com.andrii.nekon.dto.*;
import com.andrii.nekon.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Все эти endpoints требуют JWT токен —
// это уже настроено в SecurityConfig (/api/cart/** → authenticated)
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // Получить текущую корзину пользователя
    // GET http://localhost:8080/api/cart
    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    // Добавить товар в корзину
    // POST http://localhost:8080/api/cart/add
    // Body: { "productId": 1, "quantity": 1 }
    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> addToCart(
            @RequestBody AddToCartRequestDTO request
    ) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    // Изменить количество товара
    // PUT http://localhost:8080/api/cart/{productId}?quantity=3
    @PutMapping("/{productId}")
    public ResponseEntity<CartResponseDTO> updateQuantity(
            @PathVariable Long productId,
            @RequestParam Integer quantity
    ) {
        return ResponseEntity.ok(cartService.updateQuantity(productId, quantity));
    }

    // Удалить один товар из корзины
    // DELETE http://localhost:8080/api/cart/{productId}
    @DeleteMapping("/{productId}")
    public ResponseEntity<CartResponseDTO> removeFromCart(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(cartService.removeFromCart(productId));
    }

    // Очистить всю корзину
    // DELETE http://localhost:8080/api/cart
    @DeleteMapping
    public ResponseEntity<?> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok("Cart cleared");
    }
}
