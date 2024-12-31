import { useAuth } from "@/app/(auth)/AuthContext";
import { Endpoint } from "@/types";

interface EndpointCardProps {
    endpoint: Endpoint;
    onDeleteEndpoint: (endpoint: Endpoint) => void;
    onModifyEndpoint: (endpoint: Endpoint) => void;
}

const EndpointCard = ({ endpoint, onDeleteEndpoint, onModifyEndpoint }: EndpointCardProps) => {

    const { user_id } = useAuth()

    const deleteEndpoint = () => {
        onDeleteEndpoint(endpoint);
    }
    const modifyEndpoint = () => {
        onModifyEndpoint(endpoint);
    }

    return (
        <li>
            <div className="card bg-primary text-primary-content w-100 shadow-xl ">
                <div className="card-body">
                    <h2 className="font-bold text-lg">{endpoint.name}</h2>
                    <p>{endpoint.description}</p>
                    <p><strong>Path:</strong> {endpoint.path}</p>
                    <div className="badge badge-secondary">
                        {endpoint.method}
                    </div>
                    <div className="card-actions justify-end">
                        <button className="btn btn-secondary">
                            {`${process.env.NEXT_PUBLIC_BACKEND_URL}/v/${user_id}${endpoint.path}`}
                        </button>
                        <button className="btn" onClick={modifyEndpoint}>
                            Edit endpoint
                        </button>
                        <button className="btn btn-secondary" onClick={deleteEndpoint}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default EndpointCard;