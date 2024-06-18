import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isAuthenticated: () => boolean;
  loginPath?: string;
};

export function ProtectedRoute({ children, isAuthenticated, loginPath = "/login" }: Props) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
