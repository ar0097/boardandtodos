import { Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // or loader
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
