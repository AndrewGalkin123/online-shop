package com.andrii.nekon.dto;

import com.andrii.nekon.model.ProductAttributes;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UpdateProductDTO {
    private String name;
    private String description;
    private Double price;
    private Double originalPrice;
    private Boolean onSale;
    private Integer stock;
    private Long categoryId;
    private Integer mainImageIndex;
    private ProductAttributes attributes;
}