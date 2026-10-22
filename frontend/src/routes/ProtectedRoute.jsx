
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ permissao, children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Verificando autorização...</div>;
    }

    if (!user) {
        return <Navigate to="/home" replace />;
    }

    const permissoes = user.permissions ?? [];

    if (!permissoes.includes(permissao)) {
        return <Navigate to="/home" replace />;
    }

    return children;
}
