package com.andrii.nekon.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponseDTO {

    private Long productId;
    private String productName;
    private Double price;
    private String mainImage;  // чтобы показать картинку в корзине
    private Integer quantity;
    private Double totalPrice; // price * quantity — удобно для фронтенда
}