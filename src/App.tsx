import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import UserRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoute";
import { RootState } from "./store";
import { SocketProvider } from "./providers/socketProvider";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    if (user?.isAdmin) {
      setIsAdmin(true);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <SocketProvider>
        {isAdmin ? <AdminRoutes /> : <UserRoutes />}
      </SocketProvider>
    </BrowserRouter>
  );
};

export default App;
