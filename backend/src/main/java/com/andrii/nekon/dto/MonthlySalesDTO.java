package com.andrii.nekon.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MonthlySalesDTO {
    private LocalDateTime month;
    private Long totalOrders;
    private Double totalRevenue;
}