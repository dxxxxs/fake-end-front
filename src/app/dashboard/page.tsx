"use client"
import EndpointCreationForm from "./components/EndpointCreationForm";
import { withAuth } from "../core/hoc/withAuth";
import { getEndpoints } from "./services/get-endpoints";
import { Endpoint, EndpointsData } from "@/types";
import { useEffect, useRef, useState } from "react";
import EndpointCard from "./components/EndpointCard";
import { deleteEndpoint } from "./services/delete-endpoint";

const Dashboard = () => {

    const [endpoints, setEndpoints] = useState<EndpointsData | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEndpoints = async () => {
            const result = await getEndpoints();
            setEndpoints(result);
            setLoading(false);
        };

        fetchEndpoints();
    }, []);

    const handleOnSubmitForm = (newEndpoint: Endpoint | null) => {
        if (!newEndpoint) return;

        setEndpoints((prev) => {
            if (!prev) return [newEndpoint];

            const existingIndex = prev.findIndex((endpoint) => endpoint._id === newEndpoint._id);

            if (existingIndex !== -1) {
                const updatedEndpoints = [...prev];
                updatedEndpoints[existingIndex] = newEndpoint;
                return updatedEndpoints;
            }

            return [...prev, newEndpoint];
        });
    };


    const handleOnDeleteEndpoint = async (endpoint: Endpoint) => {
        if (endpoint._id) {
            const result = await deleteEndpoint(endpoint._id);
            if (result) {
                setEndpoints((prevData) => prevData?.filter((item) => item._id !== endpoint._id) || null);
            } else {
                console.error(`Failed to delete endpoint with ID ${endpoint._id}`);
            }
        }

    };

    const openEndpointCreationForm = (endpoint: Endpoint) => {
        if (creationFormRef.current) {
            creationFormRef.current.setEndpoint(endpoint);
            creationFormRef.current.openModal();
        }
    }

    const blankEndpoint: Endpoint = {
        name: '',
        path: '',
        method: 'GET',
        statusCode: 200,
        body: {},
        headers: {},
        queryParams: {},
        description: '',
        isActive: true,
        responseDelay: 0,
        responseBody: {},
        responseHeaders: {},
    };

    const creationFormRef = useRef<{
        setEndpoint: (endpoint: Endpoint) => void;
        openModal: () => void;
    } | null>(null);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="container">
            <h1>Dashboard</h1>
            <button className="btn" onClick={() => openEndpointCreationForm(blankEndpoint)}>
                Create endpoint
            </button>
            <EndpointCreationForm
                onSubmitForm={handleOnSubmitForm}
                ref={creationFormRef}
            />
            <ul>
                {endpoints && endpoints.map((endpoint) => (
                    <EndpointCard
                        key={endpoint._id}
                        endpoint={endpoint}
                        onDeleteEndpoint={handleOnDeleteEndpoint}
                        onModifyEndpoint={openEndpointCreationForm}
                    />
                ))}
            </ul>
        </div>
    );
}

export default withAuth(Dashboard);