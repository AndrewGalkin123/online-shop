package com.andrii.nekon.controller;

import com.andrii.nekon.dto.*;
import com.andrii.nekon.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager/orders")
@RequiredArgsConstructor
public class ManagerOrderController {

    private final OrderService orderService;

    // Все заказы — только для ADMIN
    // GET http://localhost:8080/api/admin/orders
    @GetMapping
    @PreAuthorize("hasAnyRole(\"MANAGER\", \"ADMIN\")")
    public ResponseEntity<List<OrderSummaryDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Детали одного заказа с товарами
    // GET http://localhost:8080/api/orders/1
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole(\"MANAGER\", \"ADMIN\")")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderDetails(id));
    }

    // Изменить статус заказа
    // PATCH http://localhost:8080/api/admin/orders/1/status
    // Body: { "status": "PROCESSING" }
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole(\"MANAGER\", \"ADMIN\")")
    public ResponseEntity<OrderSummaryDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusDTO request
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus()));
    }
}
