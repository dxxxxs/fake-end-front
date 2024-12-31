import { customFetch } from "@/app/core/services/api";
import { Endpoint } from "@/types";
import Cookies from "js-cookie";

interface DeleteEndpointResponse {
    message: string,
    data: Endpoint,
    _id: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}

export const deleteEndpoint = async (endpoint_id: string): Promise<Endpoint | null> => {
    try {
        const token = Cookies.get("token");
        if (!token) {
            console.log("No auth token");
            return null;
        }

        const response = await customFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/endpoint/${endpoint_id}`, token,
            {
                method: 'DELETE'
            }
        )

        if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
            return null;
        }

        const result: DeleteEndpointResponse = await response.json();

        const data = result.data;

        return data

    } catch (err) {
        console.log(err)
        return null;
    }
}

