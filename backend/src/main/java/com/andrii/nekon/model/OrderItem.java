package com.andrii.nekon.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@IdClass(OrderItemId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    private Double price;
}