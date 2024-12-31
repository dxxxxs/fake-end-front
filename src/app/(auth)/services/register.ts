import { RegisterData } from "@/types";

interface RegisterResponse {
    message: string,
    _id: string,
    token: string
}

export const register = async (data: RegisterData): Promise<RegisterResponse | null> => {
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        );
        if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
            return null;
        }

        const result: RegisterResponse = await response.json();

        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}