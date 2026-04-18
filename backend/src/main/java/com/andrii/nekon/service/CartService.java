package com.andrii.nekon.service;

import com.andrii.nekon.dto.*;
import com.andrii.nekon.model.*;
import com.andrii.nekon.repository.*;
import com.andrii.nekon.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // ─── Вспомогательный метод: получить текущего пользователя из JWT ───────
    // SecurityContextHolder хранит информацию о том кто сделал запрос.
    // JwtAuthenticationFilter поместил туда пользователя при каждом запросе.
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ─── Вспомогательный метод: получить корзину пользователя ───────────────
    // Если корзины ещё нет — создаём её автоматически.
    // Так работает большинство магазинов: корзина создаётся при первом добавлении.
    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    // ─── Получить корзину текущего пользователя ──────────────────────────────
    public CartResponseDTO getCart() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        return mapToCartResponse(cart);
    }

    // ─── Добавить товар в корзину ────────────────────────────────────────────
    @Transactional
    public CartResponseDTO addToCart(AddToCartRequestDTO request) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Смотрим: этот товар уже есть в корзине?
        cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .ifPresentOrElse(
                        existingItem -> {
                            int newQuantity = existingItem.getQuantity() + request.getQuantity();

                            if (!productRepository.isProductInStock(product.getId())) {
                                throw new RuntimeException("Product is out of stock");
                            }

                            // Проверяем ИТОГОВОЕ количество — уже в корзине + новое
                            if (newQuantity > product.getStock()) {
                                throw new RuntimeException(
                                        "Cannot add " + request.getQuantity() + " more. " +
                                                "In cart: " + existingItem.getQuantity() + ", " +
                                                "available: " + product.getStock()
                                );
                            }

                            existingItem.setQuantity(newQuantity);
                            cartItemRepository.save(existingItem);
                        },
                        () -> {

                            if (!productRepository.isProductInStock(product.getId())) {
                                throw new RuntimeException("Product is out of stock");
                            }

                            // Товара нет в корзине — проверяем просто запрошенное количество
                            if (request.getQuantity() > product.getStock()) {
                                throw new RuntimeException(
                                        "Not enough stock. Requested: " + request.getQuantity() +
                                                ", available: " + product.getStock()
                                );
                            }

                            CartItem newItem = new CartItem();
                            newItem.setCart(cart);
                            newItem.setProduct(product);
                            newItem.setQuantity(request.getQuantity());
                            cartItemRepository.save(newItem);
                        }
                );

        Cart updatedCart = cartRepository.findByUserId(user.getId()).orElseThrow();
        return mapToCartResponse(updatedCart);
    }

    // ─── Изменить количество товара ──────────────────────────────────────────
    @Transactional
    public CartResponseDTO updateQuantity(Long productId, Integer quantity) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (quantity <= 0) {
            // Если количество 0 или меньше — удаляем товар из корзины
            cartItemRepository.deleteByCartIdAndProductId(cart.getId(), productId);
        } else if( quantity <= item.getProduct().getStock() ){
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        } else {
            // Количество превышает остаток — сообщаем об этом явно
            throw new RuntimeException(
                    "Only " + item.getProduct().getStock() + " items available in stock"
            );
        }

        Cart updatedCart = cartRepository.findByUserId(user.getId()).orElseThrow();
        return mapToCartResponse(updatedCart);
    }

    // ─── Удалить товар из корзины ────────────────────────────────────────────
    @Transactional
    public CartResponseDTO removeFromCart(Long productId) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        cartItemRepository.deleteByCartIdAndProductId(cart.getId(), productId);

        Cart updatedCart = cartRepository.findByUserId(user.getId()).orElseThrow();
        return mapToCartResponse(updatedCart);
    }

    // ─── Очистить всю корзину ────────────────────────────────────────────────
    // Вызывается после успешного оформления заказа
    @Transactional
    public void clearCart() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        // Удаляем все позиции из корзины
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    // ─── Маппинг Cart → CartResponseDTO ─────────────────────────────────────
    // Приватный метод — превращаем внутреннюю модель в ответ для фронтенда
    private CartResponseDTO mapToCartResponse(Cart cart) {

        List<CartItemResponseDTO> items = cart.getCartItems() == null
                ? List.of()
                : cart.getCartItems().stream()
                .map(this::mapToItemResponse)
                .toList();

        double grandTotal = items.stream()
                .mapToDouble(CartItemResponseDTO::getTotalPrice)
                .sum();

        return new CartResponseDTO(items, grandTotal, items.size());
    }

    private CartItemResponseDTO mapToItemResponse(CartItem item) {
        Product p = item.getProduct();

        // Берём главную картинку товара
        String mainImage = p.getImages().stream()
                .filter(img -> Boolean.TRUE.equals(img.getIsMain()))
                .map(img -> img.getImageUrl())
                .findFirst()
                .orElse(p.getImages().isEmpty() ? null : p.getImages().get(0).getImageUrl());

        return new CartItemResponseDTO(
                p.getId(),
                p.getName(),
                p.getPrice(),
                mainImage,
                item.getQuantity(),
                p.getPrice() * item.getQuantity() // totalPrice
        );
    }

}
