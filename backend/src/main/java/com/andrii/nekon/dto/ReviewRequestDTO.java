package com.andrii.nekon.dto;

import lombok.*;

import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDTO {
    @NotNull(message = "Product is required")
    private Long productId;

    @NotBlank(message = "Message is required")
    @Size(min = 3, max = 1000, message = "Message must be between 3 and 1000 characters")
    private String message;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
}
