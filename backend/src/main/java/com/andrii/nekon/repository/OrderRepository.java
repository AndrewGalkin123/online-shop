package com.andrii.nekon.repository;

import com.andrii.nekon.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Все заказы конкретного пользователя, отсортированные по дате (новые первые)
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}