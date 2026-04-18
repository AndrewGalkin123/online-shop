package com.andrii.nekon.dto;

import com.andrii.nekon.model.OrderStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusDTO {
    private OrderStatus status; // новый статус
}