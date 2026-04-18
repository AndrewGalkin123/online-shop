package com.andrii.nekon.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;

@Immutable
@Entity
@Table(name = "view_top_rated_products")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TopRatedProductView {
    @Id
    private Long id;

    private String name;

    // average_rating в БД — numeric, в Java — BigDecimal
    @Column(name = "average_rating")
    private BigDecimal averageRating;

    @Column(name = "reviews_count")
    private Long reviewsCount;
}
