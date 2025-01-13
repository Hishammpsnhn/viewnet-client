import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  return isAuthenticated && user?.Admin ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default AdminProtectedRoute;
