import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {
        return
        <main className="flex flex-col relative w-full h-full items-center justify-center gap-10">
            <div className="three-body">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
            </div>
        </main>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}