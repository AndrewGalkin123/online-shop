package com.andrii.nekon.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewsDTO {
    private Double averageRating;
    private Integer totalReviews;
    private List<ReviewResponseDTO> reviews;
}
