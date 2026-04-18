package com.andrii.nekon.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;
import java.time.LocalDateTime;

// monthly_sales_report не имеет id — используем month как id
@Entity
@Immutable
@Table(name = "monthly_sales_report")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySalesView {

    @Id
    private LocalDateTime month;

    @Column(name = "total_orders")
    private Long totalOrders;

    @Column(name = "total_revenue")
    private Double totalRevenue;
}