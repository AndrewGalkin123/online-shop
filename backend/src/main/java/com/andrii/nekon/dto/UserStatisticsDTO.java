package com.andrii.nekon.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UserStatisticsDTO {
    private Long id;
    private String email;
    private Long totalOrders;
    private Double totalSpent;
}