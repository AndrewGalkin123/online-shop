import { showToast } from "../utils/toast";

const API_URL = "http://localhost:8080/api";



const getToken = () => localStorage.getItem("token");

export const request = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 429) {
        throw new Error("Too many login attempts. Please wait 1 minute.");
    }

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("Please log in again.", "error");
        return;
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
            error.message || error.error || "Something went wrong"
        );
    }

    const text = await response.text();
    try {
        return text ? JSON.parse(text) : null;
    } catch {
        return text;
    }
};