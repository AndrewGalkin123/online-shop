package com.andrii.nekon.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDTO {
    private String message;
    private Integer rating;
    private Long productId;
}
