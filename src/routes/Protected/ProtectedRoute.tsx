import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) =>  state.user);
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute
