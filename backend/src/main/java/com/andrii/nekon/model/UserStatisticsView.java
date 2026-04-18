package com.andrii.nekon.model;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "view_user_statistics")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserStatisticsView {
    @Id
    private Long id;

    private String email;

    @Column(name = "total_orders")
    private Long totalOrders;

    @Column(name = "total_spent")
    private Double totalSpent;
}
