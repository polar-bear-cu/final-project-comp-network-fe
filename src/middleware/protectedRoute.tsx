import { Navigate } from "react-router-dom";
import { JWT } from "../utils/const";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem(JWT);

  if (!token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
