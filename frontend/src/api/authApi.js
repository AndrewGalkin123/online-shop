import { request } from "./api";

export const register = async (email, password, firstName, lastName, phone) => {
    return request(
        "/auth/register",
        {
            method: "POST",
            body: JSON.stringify({ email, password, firstName, lastName, phone }),
        }
    );
}

export const login = async (email, password) => {
    const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: data.role,
        }));
    }

    return data;
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
        return JSON.parse(user);
    }
    return null;
};

// Удаление аккаунта
export const deleteMyAccount = async () => {
    return request("/users/me", {
        method: "DELETE",
    });
};