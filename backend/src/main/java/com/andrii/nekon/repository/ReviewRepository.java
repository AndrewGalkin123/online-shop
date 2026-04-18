package com.andrii.nekon.repository;

import com.andrii.nekon.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Все отзывы на конкретный товар — для страницы товара
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    // Проверяем: оставлял ли этот пользователь отзыв на этот товар?
    // Нужно чтобы не допустить дублей
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    // Ищем отзыв по id и userId — для удаления.
    // Пользователь может удалить только СВОЙ отзыв
    Optional<Review> findByIdAndUserId(Long id, Long userId);
}