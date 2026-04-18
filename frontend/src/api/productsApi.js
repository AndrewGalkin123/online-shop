import { request } from "./api";

export const getProductsByCategory = async (slug, page = 0, size = 12) => {
    return request(`/categories/${slug}/products?page=${page}&size=${size}`);
};

export const getProductById = async (id) => {
    return request(`/products/${id}`);
};

export const getProductsByIds = async (ids) => {
    return request(`/by-ids`,{
        method: "POST",
        body: JSON.stringify(ids),
    });
};