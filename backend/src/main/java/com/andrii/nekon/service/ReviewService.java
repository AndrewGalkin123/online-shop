package com.andrii.nekon.service;

import com.andrii.nekon.dto.*;
import com.andrii.nekon.model.*;
import com.andrii.nekon.repository.*;
import com.andrii.nekon.security.CustomUserDetails;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final TopRatedProductRepository topRatedProductRepository;

    // EntityManager нужен для вызова нативных функций БД
    // таких как get_product_average_rating()
    @PersistenceContext
    private EntityManager entityManager;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public ReviewResponseDTO createReview(ReviewRequestDTO request) {
        User user = getCurrentUser();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Проверяем рейтинг — только от 1 до 5
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        reviewRepository.findByUserIdAndProductId(user.getId(), product.getId()).ifPresent(review -> {
            throw new RuntimeException("You have already reviewed this product");
        });

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setCreatedAt(LocalDateTime.now());
        review.setMessage(request.getMessage());

        Review saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    // ─── Получить все отзывы товара + средний рейтинг ────────────────────────
    // Используем функцию get_product_average_rating() из БД
    public ProductReviewsDTO getProductReviews(Long productId) {

        // Вызываем нашу PostgreSQL функцию напрямую через EntityManager.
        // Функция считает AVG в БД — не в Java коде.
        Double avgRating = (Double) entityManager
                .createNativeQuery(
                        "SELECT CAST(get_product_average_rating(:productId) AS DOUBLE PRECISION)"
                )
                .setParameter("productId", productId)
                .getSingleResult();

        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);

        List<ReviewResponseDTO> reviewDTOs = reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new ProductReviewsDTO(avgRating, reviewDTOs.size(), reviewDTOs);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        User user = getCurrentUser();

        reviewRepository.findByIdAndUserId(reviewId, user.getId()).ifPresent(review -> {
            reviewRepository.delete(review);
        });
    }


    public List<TopRatedProductDTO> getTopRatedProducts(){
        return topRatedProductRepository.findAllByOrderByAverageRatingDesc()
                .stream()
                .map(product ->
                    new TopRatedProductDTO(
                            product.getId(),
                            product.getName(),
                            product.getAverageRating(),
                            product.getReviewsCount()
                    )
                )
                .collect(Collectors.toList());
    }


    private ReviewResponseDTO mapToResponse(Review review) {
        return new ReviewResponseDTO(
                review.getId(),
                review.getMessage(),
                review.getRating(),
                review.getUser().getFirstName(),
                review.getCreatedAt(),
                review.getUser().getEmail()
        );
    }
}
