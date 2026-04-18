package com.andrii.nekon.model;

import lombok.*;

// Этот класс представляет JSON структуру поля attributes в таблице products.
// Jackson (встроен в Spring) автоматически конвертирует объект ↔ JSON строку.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttributes {
    private String size;
    private String rarity;
    private String quality;
    private String manufacturer;
    private String animatedCartoon;
}