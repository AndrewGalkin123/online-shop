package com.andrii.nekon.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;
import java.time.LocalDateTime;

// @Immutable говорит Hibernate: эта сущность только для чтения.
// Hibernate не будет пытаться делать INSERT/UPDATE/DELETE.
// Идеально для вьюх — они и так read-only в большинстве случаев.
@Entity
@Immutable
@Table(name = "view_order_summary")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryView {

    @Id
    private Long id; // id заказа

    private String email; // email пользователя

    private String status; // статус заказа

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "total_amount")
    private Double totalAmount; // сумма заказа — уже посчитана в вьюхе
}