package com.andrii.nekon.dto;

import com.andrii.nekon.model.ProductAttributes;
import lombok.*;

// Для создания нового товара менеджером/админом
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateProductDTO {
    private String name;
    private String description;
    private Double price;
    private Double originalPrice;
    private Boolean onSale;
    private Integer stock;
    private ProductAttributes attributes;
    private Long categoryId;
}