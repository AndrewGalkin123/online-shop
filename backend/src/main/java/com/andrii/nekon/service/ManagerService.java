package com.andrii.nekon.service;
import com.andrii.nekon.dto.*;
import com.andrii.nekon.model.*;
import com.andrii.nekon.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
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

    public List<ProductDetailDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToDetailDTO)
                .collect(Collectors.toList());
    }


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
        product.setOnSale(request.getOnSale());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setStock(request.getStock());
        product.setAttributes(attributesJson);
        product.setCategory(category);

        Product saved = productRepository.save(product);

        List<ProductImage> images = generateImages(saved, category.getSlug(), request.getImageCount());
        saved.setImages(images);
        productRepository.save(saved);

        List<String> imagePaths = images.stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

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
                imagePaths
        );
    }

    @Transactional
    public ProductDetailDTO updateProduct(Long productId, UpdateProductDTO request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getOriginalPrice() != null) product.setOriginalPrice(request.getOriginalPrice());
        if (request.getOnSale() != null) product.setOnSale(request.getOnSale());
        if (request.getStock() != null) product.setStock(request.getStock());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        if (request.getAttributes() != null) {
            try {
                product.setAttributes(objectMapper.writeValueAsString(request.getAttributes()));
            } catch (Exception e) {
                throw new RuntimeException("Failed to serialize attributes");
            }
        }

        // Смена главной фотки
        // Смена главной фотки — просто по индексу в списке
        if (request.getMainImageIndex() != null) {
            List<ProductImage> images = product.getImages();
            for (int i = 0; i < images.size(); i++) {
                // mainImageIndex: 1, 2, 3, 4 → i+1
                images.get(i).setIsMain(i + 1 == request.getMainImageIndex());
            }
        }

        Product saved = productRepository.save(product);
        return mapToDetailDTO(saved);
    }

    // Удалить продукт
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    private List<ProductImage> generateImages(Product product, String categorySlug, Integer imageCount) {
        // "Demon Slayer" → "DemonSlayer"
        String cleanName = product.getName().replaceAll("\\s+", "");

        int count = (imageCount != null && imageCount == 4) ? 4 : 1;

        List<ProductImage> images = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            ProductImage image = new ProductImage();
            image.setProduct(product);

            // Пробуем jpg, если нет — png
            // Путь: /images/sale/DemonSlayer1.jpg
            image.setImageUrl("/images/" + categorySlug + "/" + cleanName + i + ".jpg");
            image.setAltText(product.getName() + " view " + i);
            image.setIsMain(i == 1); // первая фото — главная
            images.add(image);
        }
        return images;
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

    @Transactional
    public void activateUser(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setIsActive(true);
        });
    }

    private ProductDetailDTO mapToDetailDTO(Product product) {
        List<String> images = product.getImages().stream()
                .sorted((a, b) -> Boolean.compare(
                        !Boolean.TRUE.equals(a.getIsMain()),
                        !Boolean.TRUE.equals(b.getIsMain())
                ))
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        return new ProductDetailDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getOriginalPrice(),
                product.getOnSale(),
                product.getStock(),
                product.getAttributes(),
                product.getCategory().getSlug(),
                product.getCategory().getName(),
                images
        );
    }
}
