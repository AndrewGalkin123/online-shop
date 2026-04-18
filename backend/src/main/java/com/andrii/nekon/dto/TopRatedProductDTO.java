package com.andrii.nekon.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopRatedProductDTO {
    private Long id;
    private String name;
    private BigDecimal averageRating;
    private Long reviewsCount;
}