package com.andrii.nekon.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequestDTO {

    private Long productId;  // какой товар добавить
    private Integer quantity; // сколько штук (обычно 1)
}