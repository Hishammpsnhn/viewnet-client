import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) =>  state.user
  );

  return isAuthenticated && user?.isAdmin ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default AdminProtectedRoute;
