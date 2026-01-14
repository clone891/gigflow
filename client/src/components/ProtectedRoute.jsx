import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <p className="p-4">Checking authentication...</p>;
  }

  // 🔑 Redirect unauthenticated users to Landing
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
