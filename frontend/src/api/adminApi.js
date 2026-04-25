import { request } from "./api";

// ─── Пользователи ────────────────────────────────────────────────────────────
export const getAllUsers = () => request("/manager/users");
export const getUserById = (id) => request(`/manager/users/${id}`);
export const getUserStatistics = () => request("/manager/users/statistics");
export const changeUserRole = (id, role) =>
    request(`/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
    });
export const deactivateUser = (id) =>
    request(`/admin/users/${id}`, { method: "DELETE" });

export const activateUser = (id) =>
    request(`/admin/users/${id}`, { method: "PATCH" });


// ─── Заказы ───────────────────────────────────────────────────────────────────
export const getAllOrders = () => request("/manager/orders");
export const getOrderDetails = (id) => request(`/manager/orders/${id}`);
export const updateOrderStatus = (id, status) =>
    request(`/manager/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });

// ─── Товары ───────────────────────────────────────────────────────────────────
export const createProduct = (data) =>
    request("/manager/products", {
        method: "POST",
        body: JSON.stringify(data),
    });
export const updateStock = (id, stock) =>
    request(`/manager/products/${id}/stock`, {
        method: "PATCH",
        body: JSON.stringify({ stock }),
    });
export const getLowStockProducts = () => request("/manager/products/low-stock");
export const getProductSales = () => request("/manager/products/sales");
export const getTopRatedProducts = () => request("/manager/products/top-rated");

export const getAllProducts = () => request("/manager/products");
export const updateProduct = (id, data) =>
    request(`/manager/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
export const deleteProduct = (id) =>
    request(`/manager/products/${id}`, { method: "DELETE" });

// ─── Отчёты ───────────────────────────────────────────────────────────────────
export const getMonthlySales = () => request("/manager/reports/monthly");

// ─── Логи ─────────────────────────────────────────────────────────────────────
export const getUserLogs = () => request("/admin/logs");

