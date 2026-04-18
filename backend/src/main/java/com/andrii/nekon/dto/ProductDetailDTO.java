package com.andrii.nekon.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailDTO {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private Double originalPrice;
    private Boolean onSale;
    private Integer stock;
    private String attributes;
    private String categorySlug;
    private String categoryName;
    private List<String> images;
}
