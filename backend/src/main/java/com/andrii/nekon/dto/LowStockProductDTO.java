package com.andrii.nekon.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LowStockProductDTO {
    private Long id;
    private String name;
    private Integer stockQuantity;
    private String categoryName;
}