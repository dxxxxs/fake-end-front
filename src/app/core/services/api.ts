import { logout } from "@/app/(auth)/services/logout";

export const customFetch = async (url: string, token: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401 || response.status === 403) {
        handleLogout();
        return Promise.reject(new Error('Unauthorized or Forbidden'));
    }

    return response;
};

const handleLogout = () => {
    logout();
};