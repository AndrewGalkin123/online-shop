package com.andrii.nekon.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "view_low_stock_products")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LowStockProductView {

    @Id
    private Long id;

    private String name;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "category_name")
    private String categoryName;
}