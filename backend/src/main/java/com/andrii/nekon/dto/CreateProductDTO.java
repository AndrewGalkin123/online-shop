package com.andrii.nekon.dto;

import com.andrii.nekon.model.ProductAttributes;
import lombok.*;
import jakarta.validation.constraints.*;

// Для создания нового товара менеджером/админом
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateProductDTO {
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name too long")
    private String name;

    @Size(max = 2000, message = "Description too long")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @Positive(message = "Original price must be positive")
    private Double originalPrice;

    private Boolean onSale;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @Min(value = 1, message = "Image count must be 1 or 4")
    @Max(value = 4, message = "Image count must be 1 or 4")
    private Integer imageCount;

    private ProductAttributes attributes;
}