package com.andrii.nekon.repository;

import com.andrii.nekon.model.OrderItem;
import com.andrii.nekon.model.OrderItemId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemId> {
}