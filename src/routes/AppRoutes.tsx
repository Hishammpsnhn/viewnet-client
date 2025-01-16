import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { HomePage } from "../pages/user/HomePage";
import MainLayout from "../layouts/MainLayout";
import ProfileCreation from "../pages/user/ProfileCreation";
import EmptyLayout from "../layouts/EmptyLayout";
import Settings from "../pages/user/SettingsPage";
import SecondaryLayout from "../layouts/SecondaryLayout";
import { useEffect, useState } from "react";
import { getME } from "../reducers/authReducers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import ProtectedRoute from "./Protected/ProtectedRoute";
import PlansPage from "../pages/user/PlansPage";
import ProfileEditPage from "../pages/user/ProfileEditPage";

const AppRoutes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getME()).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);
  useEffect(() => {
    if (user && !user.profiles.length) {
      navigate(`/profile/${user._id}`);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute>
            <EmptyLayout>
              <ProfileCreation />
            </EmptyLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SecondaryLayout>
              <Settings />
            </SecondaryLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/editprofile"
        element={
          <ProtectedRoute>
            <SecondaryLayout>
              <ProfileEditPage />
            </SecondaryLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/plans"
        element={
          <SecondaryLayout>
            <PlansPage isAdmin={false} />
          </SecondaryLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
