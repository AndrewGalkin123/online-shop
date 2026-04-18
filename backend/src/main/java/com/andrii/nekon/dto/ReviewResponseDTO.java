package com.andrii.nekon.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
    private Long id;
    private String message;
    private Integer rating;
    private String authorName;
    private LocalDateTime createdAt;
}
