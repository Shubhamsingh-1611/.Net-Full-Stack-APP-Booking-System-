import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Change Navigate to useNavigate
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

export const RoleGuard = ({ children, allowedRoles = [] }) => {
    const { instance, accounts, inProgress } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate(); // Initialize the navigate hook

    useEffect(() => {
        // Correctly redirect using the navigate function
        if (inProgress === InteractionStatus.None && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [inProgress, isAuthenticated, navigate]);

    if (inProgress !== InteractionStatus.None || !isAuthenticated) {
        return <div>Redirecting to login...</div>;
    }

    // Extract user roles safely from the token claims array
    const userRoles = accounts[0]?.idTokenClaims?.roles || [];

    // Core Function: If roles are specified, ensure the user has at least one of them
    if (allowedRoles.length > 0) {
        const hasRole = allowedRoles.some((role) => userRoles.includes(role));
        if (!hasRole) {
            return <div style={{ padding: "20px", color: "red" }}>Access Denied: You do not have permission to view this page.</div>;
        }
    }

    // If logged in and authorized, render the page content
    return <>{children}</>;
};
