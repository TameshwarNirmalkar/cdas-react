import { Navigate } from "react-router-dom";

// A simple wrapper to protect routes
const ProtectedRoute = ({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  export default ProtectedRoute