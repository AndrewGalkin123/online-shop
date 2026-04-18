package com.andrii.nekon.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemResponseDTO> items;
    private Double totalAmount;
}