package com.andrii.nekon.dto;

import lombok.*;
import java.time.LocalDateTime;

// Используем для списков заказов — не грузим товары каждого заказа.
// Данные берём прямо из view_order_summary.
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderSummaryDTO {
    private Long id;
    private String email;
    private String status;
    private LocalDateTime createdAt;
    private Double totalAmount;
}