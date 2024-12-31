import { Endpoint } from "@/types";
import Cookies from "js-cookie";
import { customFetch } from "@/app/core/services/api";

interface UpdateEndpointResponse {
    message: string,
    data: Endpoint
}

export const updateEndpoint = async (endpoint: Endpoint): Promise<Endpoint | null> => {
    try {
        const token = Cookies.get("token");
        if (!token) {
            console.log("No auth token");
            return null;
        }
        console.log(endpoint._id)

        const response = await customFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/endpoint/${endpoint._id}`, token,
            {
                method: 'PATCH',
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

        const result: UpdateEndpointResponse = await response.json();

        const data = result.data;

        return data

    } catch (err) {
        console.log(err)
        return null;
    }
}

