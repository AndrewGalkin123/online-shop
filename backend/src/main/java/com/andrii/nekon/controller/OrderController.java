package com.andrii.nekon.controller;

import com.andrii.nekon.dto.*;
import com.andrii.nekon.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Оформить заказ из текущей корзины
    // POST http://localhost:8080/api/orders
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(
            @RequestBody CreateOrderRequestDTO request
    ) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    // История своих заказов (через view_order_summary)
    // GET http://localhost:8080/api/orders
    @GetMapping
    public ResponseEntity<List<OrderSummaryDTO>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    // Детали одного заказа с товарами
    // GET http://localhost:8080/api/orders/1
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
}