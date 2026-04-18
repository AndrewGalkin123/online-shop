import { request } from "./api";

export const getCart = async () => request("/cart");

export const addToCart = async (productId, quantity = 1) =>
    request("/cart/add", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
    });

export const updateCartQuantity = async (productId, quantity) =>
    request(`/cart/${productId}?quantity=${quantity}`, { method: "PUT" });

export const removeFromCart = async (productId) =>
    request(`/cart/${productId}`, { method: "DELETE" });

export const clearCart = async () =>
    request("/cart", { method: "DELETE" });