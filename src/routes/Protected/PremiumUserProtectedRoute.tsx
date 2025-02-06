import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const PremiumUserProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, planDetails } = useSelector(
    (state: RootState) => state.user
  );
  return isAuthenticated && planDetails ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default PremiumUserProtectedRoute;
