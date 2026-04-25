package com.andrii.nekon.controller;

import com.andrii.nekon.dto.ProductReviewsDTO;
import com.andrii.nekon.dto.ReviewRequestDTO;
import com.andrii.nekon.dto.ReviewResponseDTO;
import com.andrii.nekon.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createReview(
            @Valid @RequestBody ReviewRequestDTO request
    ) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

    // Все отзывы товара + средний рейтинг — публичный
    // GET http://localhost:8080/api/reviews/product/1
    @GetMapping("/product/{productId}")
    public ResponseEntity<ProductReviewsDTO> getProductReviews(@PathVariable Long productId) {
         return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    // Удалить свой отзыв — нужен токен
    // DELETE http://localhost:8080/api/reviews/1
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted");
    }
}
