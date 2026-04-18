package com.andrii.nekon.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProductSalesDTO {
    private Long id;
    private String name;
    private Long totalSold;
    private Double revenue;
}