package com.andrii.nekon.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductListDTO {

    private Long id;
    private String name;
    private Double price;
    private Double originalPrice;
    private Boolean onSale;
    private Integer stock;
    private String categorySlug;
    private String mainImage;
}
