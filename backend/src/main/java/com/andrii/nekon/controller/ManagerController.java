package com.andrii.nekon.controller;

import com.andrii.nekon.dto.*;
import com.andrii.nekon.service.ManagerService;
import com.andrii.nekon.service.ReviewService;
import com.andrii.nekon.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')") // на весь контроллер
public class ManagerController {

    private final ManagerService managerService;
    private final UserService userService;
    private final ReviewService reviewService;

    // ─── Товары ──────────────────────────────────────────────────────────────

    // Создать товар
    // POST /api/manager/products
    @PostMapping("/products")
    public ResponseEntity<ProductDetailDTO> createProduct(
            @Valid @RequestBody CreateProductDTO request
    ) {
        return ResponseEntity.ok(managerService.createProduct(request));
    }

    // Все продукты
    @GetMapping("/products")
    public ResponseEntity<List<ProductDetailDTO>> getAllProducts() {
        return ResponseEntity.ok(managerService.getAllProducts());
    }

    // Обновить продукт
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDetailDTO> updateProduct(
            @PathVariable Long id,
            @RequestBody UpdateProductDTO request
    ) {
        return ResponseEntity.ok(managerService.updateProduct(id, request));
    }

    // Удалить продукт
    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        managerService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted");
    }

    // Обновить остаток
    // PATCH /api/manager/products/1/stock
    @PatchMapping("/products/{id}/stock")
    public ResponseEntity<?> updateStock(
            @PathVariable Long id,
            @RequestBody UpdateStockDTO request
    ) {
        managerService.updateProductStock(id, request.getStock());
        return ResponseEntity.ok("Stock updated");
    }

    // Товары с низким остатком
    // GET /api/manager/products/low-stock
    @GetMapping("/products/low-stock")
    public ResponseEntity<List<LowStockProductDTO>> getLowStock() {
        return ResponseEntity.ok(managerService.getLowStockProducts());
    }

    // Статистика продаж товаров
    // GET /api/manager/products/sales
    @GetMapping("/products/sales")
    public ResponseEntity<List<ProductSalesDTO>> getProductSales() {
        return ResponseEntity.ok(managerService.getProductSales());
    }

    // Топ товаров по рейтингу — уже был готов
    // GET /api/manager/products/top-rated
    @GetMapping("/products/top-rated")
    public ResponseEntity<List<TopRatedProductDTO>> getTopRated() {
        return ResponseEntity.ok(reviewService.getTopRatedProducts());
    }

    // ─── Пользователи ────────────────────────────────────────────────────────

    // Список всех пользователей
    // GET /api/manager/users
    @GetMapping("/users")
    public ResponseEntity<List<UserAdminDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Профиль пользователя
    // GET /api/manager/users/1
    @GetMapping("/users/{id}")
    public ResponseEntity<UserAdminDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Статистика пользователей
    // GET /api/manager/users/statistics
    @GetMapping("/users/statistics")
    public ResponseEntity<List<UserStatisticsDTO>> getUserStatistics() {
        return ResponseEntity.ok(managerService.getUserStatistics());
    }

    // ─── Отчёты ──────────────────────────────────────────────────────────────

    // Ежемесячный отчёт
    // GET /api/manager/reports/monthly
    @GetMapping("/reports/monthly")
    public ResponseEntity<List<MonthlySalesDTO>> getMonthlySales() {
        return ResponseEntity.ok(managerService.getMonthlySales());
    }
}