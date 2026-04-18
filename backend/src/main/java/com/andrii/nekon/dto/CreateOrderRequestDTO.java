package com.andrii.nekon.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDTO {
    private String customerName;
    private String customerSurname;
    private String customerPhone;
    private String customerAddress;
}