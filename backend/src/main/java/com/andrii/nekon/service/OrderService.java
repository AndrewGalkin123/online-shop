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

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderSummaryRepository orderSummaryRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final TelegramService telegramService;

    // ─── Получить текущего пользователя из JWT ───────────────────────────────
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ─── Создать заказ из корзины ────────────────────────────────────────────
    @Transactional
    public OrderResponseDTO createOrder(CreateOrderRequestDTO request) {
        User user = getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.CREATED);
        // Добавляем информацию о доставке
        order.setCustomerName(request.getCustomerName());
        order.setCustomerSurname(request.getCustomerSurname());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerAddress(request.getCustomerAddress());

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(savedOrder);
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setPrice(cartItem.getProduct().getPrice());
                    return orderItem;
                })
                .collect(java.util.stream.Collectors.toCollection(java.util.ArrayList::new));

        savedOrder.setOrderItems(orderItems);
        orderRepository.save(savedOrder);

        cart.getCartItems().clear();
        cartRepository.save(cart);

        OrderResponseDTO response = mapToOrderResponse(savedOrder);
        sendTelegramNotification(user, response, request);

        return response;
    }

    // ─── История заказов текущего пользователя ───────────────────────────────
    // Используем view_order_summary — не грузим товары каждого заказа
    public List<OrderSummaryDTO> getMyOrders() {
        User user = getCurrentUser();

        return orderSummaryRepository
                .findByEmailOrderByCreatedAtDesc(user.getEmail())
                .stream()
                .map(this::mapToSummaryDTO)
                .toList();
    }

    // ─── Получить один заказ с товарами ──────────────────────────────────────
    public OrderResponseDTO getOrderById(Long orderId) {
        User user = getCurrentUser();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Проверяем что заказ принадлежит текущему пользователю
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return mapToOrderResponse(order);
    }

    // ─── Для ADMIN: все заказы ───────────────────────────────────────────────
    public List<OrderSummaryDTO> getAllOrders() {
        return orderSummaryRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToSummaryDTO)
                .toList();
    }

    // ─── Для ADMIN: изменить статус заказа ──────────────────────────────────
    @Transactional
    public OrderSummaryDTO updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        orderRepository.save(order);

        // Возвращаем обновлённую сводку через вьюху
        return orderSummaryRepository.findById(orderId)
                .map(this::mapToSummaryDTO)
                .orElseThrow();
    }

    // ─── Для MANAGER/ADMIN: детали любого заказа без проверки владельца ─────────
    public OrderResponseDTO getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToOrderResponse(order);
    }

    // ─── Telegram уведомление ────────────────────────────────────────────────
    private void sendTelegramNotification(User user, OrderResponseDTO order, CreateOrderRequestDTO delivery) {
        StringBuilder message = new StringBuilder();
        message.append("🛒 <b>Новый заказ #").append(order.getId()).append("</b>\n\n");
        message.append("👤 ").append(user.getFirstName()).append(" ").append(user.getLastName()).append("\n");
        message.append("📧 ").append(user.getEmail()).append("\n");
        message.append("📱 ").append(user.getPhone()).append("\n\n");
        message.append("📦 <b>Доставка:</b>\n");
        message.append("Получатель: ").append(delivery.getCustomerName() + " " + delivery.getCustomerSurname()).append("\n");
        message.append("Телефон: ").append(delivery.getCustomerPhone()).append("\n");
        message.append("Адрес: ").append(delivery.getCustomerAddress()).append("\n\n");
        message.append("<b>Товары:</b>\n");

        order.getItems().forEach(item ->
                message.append("• ").append(item.getProductName())
                        .append(" × ").append(item.getQuantity())
                        .append(" = ").append(item.getTotalPrice()).append("¥\n")
        );

        message.append("\n<b>Итого: ").append(order.getTotalAmount()).append("¥</b>");

        telegramService.sendMessage(message.toString());
    }

    // ─── Маппинг Order → OrderResponseDTO ───────────────────────────────────
    private OrderResponseDTO mapToOrderResponse(Order order) {
        List<OrderItemResponseDTO> items = order.getOrderItems().stream()
                .map(item -> new OrderItemResponseDTO(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getPrice() * item.getQuantity()
                ))
                .collect(java.util.stream.Collectors.toCollection(java.util.ArrayList::new));

        double total = items.stream()
                .mapToDouble(OrderItemResponseDTO::getTotalPrice)
                .sum();

        return new OrderResponseDTO(
                order.getId(),
                order.getStatus().name(),
                order.getCreatedAt(),
                items,
                total,
                order.getCustomerName(),    // ← добавляем
                order.getCustomerPhone(),   // ← добавляем
                order.getCustomerAddress()  // ← добавляем
        );
    }
    // ─── Маппинг OrderSummaryView → OrderSummaryDTO ──────────────────────────
    private OrderSummaryDTO mapToSummaryDTO(OrderSummaryView view) {
        return new OrderSummaryDTO(
                view.getId(),
                view.getEmail(),
                view.getStatus(),
                view.getCreatedAt(),
                view.getTotalAmount()
        );
    }
}