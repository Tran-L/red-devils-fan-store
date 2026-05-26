import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { loading, isAuthenticated, isAdmin } = useAuth();

    if (loading) {
        return (
            <main className="page page-centered">
                <div className="loading-card">Checking your session...</div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;