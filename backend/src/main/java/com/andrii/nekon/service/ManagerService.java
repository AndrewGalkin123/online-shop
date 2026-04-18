package com.andrii.nekon.service;
import com.andrii.nekon.dto.*;
import com.andrii.nekon.model.*;
import com.andrii.nekon.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManagerService {
    private final ObjectMapper objectMapper;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductSalesRepository productSalesRepository;
    private final LowStockProductRepository lowStockProductRepository;
    private final UserStatisticsRepository userStatisticsRepository;
    private final MonthlySalesRepository monthlySalesRepository;
    private final UserRepository userRepository;

    // ─── Товары ──────────────────────────────────────────────────────────────

    // Создать новый товар
    @Transactional
    public ProductDetailDTO createProduct(CreateProductDTO request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        String attributesJson;
        try {
            attributesJson = objectMapper.writeValueAsString(request.getAttributes());
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize attributes");
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setStock(request.getStock());
        product.setAttributes(attributesJson);
        product.setCategory(category);

        Product saved = productRepository.save(product);

        return new ProductDetailDTO(
                saved.getId(),
                saved.getName(),
                saved.getDescription(),
                saved.getPrice(),
                saved.getOriginalPrice(),
                saved.getOnSale(),
                saved.getStock(),
                saved.getAttributes(),
                saved.getCategory().getSlug(),
                saved.getCategory().getName(),
                List.of() // картинок пока нет — добавляются отдельно
        );
    }

    // Обновить остаток товара через процедуру БД
    @Transactional
    public void updateProductStock(Long productId, Integer newStock) {
        if (newStock < 0) {
            throw new RuntimeException("Stock cannot be negative");
        }
        productRepository.updateProductStock(productId, newStock);
    }

    // Товары с низким остатком — из view_low_stock_products
    public List<LowStockProductDTO> getLowStockProducts() {
        return lowStockProductRepository.findAllByOrderByStockQuantityAsc()
                .stream()
                .map(v -> new LowStockProductDTO(
                        v.getId(),
                        v.getName(),
                        v.getStockQuantity(),
                        v.getCategoryName()
                ))
                .collect(Collectors.toList());
    }

    // Статистика продаж — из view_product_sales
    public List<ProductSalesDTO> getProductSales() {
        return productSalesRepository.findAllByOrderByTotalSoldDesc()
                .stream()
                .map(v -> new ProductSalesDTO(
                        v.getId(),
                        v.getName(),
                        v.getTotalSold(),
                        v.getRevenue()
                ))
                .collect(Collectors.toList());
    }

    // ─── Пользователи ────────────────────────────────────────────────────────

    // Статистика пользователей — из view_user_statistics

    public List<UserStatisticsDTO> getUserStatistics() {
        return userStatisticsRepository.findAllByOrderByTotalSpentDesc()
                .stream()
                .map(v -> new UserStatisticsDTO(
                        v.getId(),
                        v.getEmail(),
                        v.getTotalOrders(),
                        v.getTotalSpent()
                ))
                .collect(Collectors.toList());
    }

    // ─── Отчёты ──────────────────────────────────────────────────────────────

    // Ежемесячный отчёт — из monthly_sales_report
    public List<MonthlySalesDTO> getMonthlySales() {
        return monthlySalesRepository.findAllByOrderByMonthDesc()
                .stream()
                .map(v -> new MonthlySalesDTO(
                        v.getMonth(),
                        v.getTotalOrders(),
                        v.getTotalRevenue()
                ))
                .collect(Collectors.toList());
    }

    // ─── Только для ADMIN ─────────────────────────────────────────────────────

    // Сменить роль пользователя через процедуру БД
    @Transactional
    public void changeUserRole(Long userId, String newRole) {
        // Проверяем что роль валидная
        List<String> validRoles = List.of("ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN");
        if (!validRoles.contains(newRole)) {
            throw new RuntimeException(
                    "Invalid role. Valid roles: ROLE_USER, ROLE_MANAGER, ROLE_ADMIN"
            );
        }
        // Вызываем процедуру change_user_role() в PostgreSQL
        userRepository.changeUserRole(userId, newRole);
    }

    // Удалить пользователя через процедуру БД
    @Transactional
    public void deleteUser(Long userId) {
        // Вызываем процедуру delete_user_by_id() в PostgreSQL
        // Процедура сама удаляет user_roles затем user
        userRepository.deleteUserById(userId);
    }
}
