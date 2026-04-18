package com.andrii.nekon.model;

// Enum — это фиксированный список значений.
// Статус заказа может быть только одним из этих пяти.
// Порядок важен — показывает жизненный цикл заказа.
public enum OrderStatus {
    CREATED,    // только что создан
    PROCESSING, // принят в обработку
    SHIPPED,    // отправлен
    DELIVERED,  // доставлен
    CANCELLED   // отменён
}