import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const RequiresAuth = (props: P) => {
        const router = useRouter();

        useEffect(() => {
            const token = Cookies.get("token");

            if (!token) {
                router.push("/login");
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };

    return RequiresAuth;
};
