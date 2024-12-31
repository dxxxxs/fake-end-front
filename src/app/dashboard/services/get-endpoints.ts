import { customFetch } from "@/app/core/services/api";
import { EndpointsAll, EndpointsData } from "@/types";
import Cookies from "js-cookie";

export const getEndpoints = async (): Promise<EndpointsData | null> => {
    try {
        const token = Cookies.get("token");
        if (!token) {
            console.log("No auth token");
            return null;
        }

        const response = await customFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/endpoint`, token,
            {
                method: 'GET'
            }
        )

        if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
            return null;
        }

        const result: EndpointsAll = await response.json();

        const data: EndpointsData = result.data;

        return data

    } catch (err) {
        console.log(err)
        return null;
    }
}

