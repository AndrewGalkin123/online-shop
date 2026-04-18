package com.andrii.nekon.dto;

import lombok.*;

// Для обновления остатка товара
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UpdateStockDTO {
    private Integer stock;
}