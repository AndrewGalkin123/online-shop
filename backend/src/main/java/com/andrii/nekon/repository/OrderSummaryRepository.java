package com.andrii.nekon.repository;

import com.andrii.nekon.model.OrderSummaryView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderSummaryRepository extends JpaRepository<OrderSummaryView, Long> {

    // Для админа — все заказы через вьюху (уже с total_amount)
    List<OrderSummaryView> findAllByOrderByCreatedAtDesc();

    // История заказов конкретного пользователя через вьюху
    List<OrderSummaryView> findByEmailOrderByCreatedAtDesc(String email);
}