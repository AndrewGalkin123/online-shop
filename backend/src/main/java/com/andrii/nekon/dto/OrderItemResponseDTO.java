package com.andrii.nekon.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponseDTO {
    private Long productId;
    private String productName;
    private Integer quantity;
    private Double price;       // цена на момент заказа
    private Double totalPrice;  // quantity * price
}