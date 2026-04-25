import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";

// roles — массив допустимых ролей, например ["ROLE_ADMIN", "ROLE_MANAGER"]
const ProtectedRoute = ({ children, roles }) => {
    const { user } = useContext(UserContext);

    // Не залогинен — на главную
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Роль не подходит — на главную
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;