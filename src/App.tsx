import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import UserRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoute";
import { RootState } from "./store";
import { SocketProvider, useSocket } from "./providers/socketProvider";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const { socket } = useSocket();

  useEffect(() => {
    if (user?.isAdmin) {
      setIsAdmin(true);
    } 
  }, [user]);

  return (
    <BrowserRouter>
      <SocketProvider>
        {/* <Suspense fallback={<div>Loading...</div>}> */}
        {isAdmin ? <AdminRoutes /> : <UserRoutes />}
        {/* </Suspense> */}
      </SocketProvider>
    </BrowserRouter>
  );
};

export default App;
