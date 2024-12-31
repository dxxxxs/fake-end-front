import { Endpoint } from "@/types";
import Cookies from "js-cookie";
import { customFetch } from "@/app/core/services/api";

interface CreateEndpointResponse {
    message: string,
    data: Endpoint,
    _id: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}

export const createEndpoint = async (endpoint: Endpoint): Promise<Endpoint | null> => {
    try {
        const token = Cookies.get("token");
        if (!token) {
            console.log("No auth token");
            return null;
        }

        const response = await customFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/endpoint`, token,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(endpoint)
            }
        )

        if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}:`);
            return null;
        }

        const result: CreateEndpointResponse = await response.json();

        const data = result.data;

        return data

    } catch (err) {
        console.log(err)
        return null;
    }
}