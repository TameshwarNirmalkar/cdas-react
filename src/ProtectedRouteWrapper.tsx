import { Navigate } from "react-router-dom";
import { hasToken } from "./auth";

export const GuestRoute = ({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) => {
  if (isAuthenticated || hasToken()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const ProtectedRoute = ({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) => {
  if (!isAuthenticated && !hasToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;