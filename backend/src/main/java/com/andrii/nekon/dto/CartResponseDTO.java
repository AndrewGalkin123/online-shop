package com.andrii.nekon.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartResponseDTO {

    private List<CartItemResponseDTO> items;
    private Double grandTotal; // сумма всей корзины
    private Integer totalItems; // сколько позиций в корзине
}