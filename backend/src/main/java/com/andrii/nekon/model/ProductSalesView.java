package com.andrii.nekon.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "view_product_sales")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSalesView {

    @Id
    private Long id;

    private String name;

    @Column(name = "total_sold")
    private Long totalSold;

    private Double revenue;
}