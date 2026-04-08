import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, hasRole } = useContext(AuthContext);

    // User is not connected
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // User has no permission to access the resource
    if (roles && !hasRole(roles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
