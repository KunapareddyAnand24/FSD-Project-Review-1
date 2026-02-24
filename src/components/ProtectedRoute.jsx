import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        const roleRedirects = {
            admin: "/admin",
            student: "/student",
            employer: "/employer",
            officer: "/officer",
        };
        return <Navigate to={roleRedirects[user.role] || "/login"} replace />;
    }

    return children;
}
