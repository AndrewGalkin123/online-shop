package com.andrii.nekon.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@IdClass(CartItemId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
}