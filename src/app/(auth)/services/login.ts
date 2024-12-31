import { LoginData } from "@/types";
import Cookies from "js-cookie";

interface LoginResponse {
    message: string;
    _id: string;
    username: string;
    token: string;
}

export const login = async (data: LoginData): Promise<LoginResponse | null> => {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
            return null;
        }

        const token = response.headers.get("x-auth-token");

        if (token) {
            Cookies.set("token", token);
        } else {
            console.error("No token received in response headers");
            return null;
        }

        const result: LoginResponse = await response.json();

        return { ...result, token };
    } catch (error) {
        console.error(error);
        return null;
    }
};
