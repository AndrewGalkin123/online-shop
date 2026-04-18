import { request } from "./api";

export const createOrder = async (customerName, customerSurname, customerPhone, customerAddress) =>
    request("/orders", {
        method: "POST",
        body: JSON.stringify({ customerName, customerSurname, customerPhone, customerAddress }),
    });

export const getMyOrders = async () => request("/orders");
export const getOrderById = async (id) => request(`/orders/${id}`);