import { request } from "./api";

export const getProductReviews = (productId) =>
    request(`/reviews/product/${productId}`);

export const createReview = (productId, message, rating) =>
    request("/reviews", {
        method: "POST",
        body: JSON.stringify({ productId, message, rating }),
    });

export const deleteReview = (reviewId) =>
    request(`/reviews/${reviewId}`, { method: "DELETE" });