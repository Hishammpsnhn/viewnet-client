import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/user/HomePage";
import MainLayout from "../layouts/MainLayout";
import ProfileCreation from "../pages/user/ProfileCreation";
import EmptyLayout from "../layouts/EmptyLayout";
import Settings from "../pages/user/SettingsPage";
import SecondaryLayout from "../layouts/SecondaryLayout";
import { useEffect } from "react";
import { getME } from "../reducers/authReducers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import ProtectedRoute from "./Protected/ProtectedRoute";
import AdminProtectedRoute from "./Protected/AdminProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRoutes = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getME());
  }, []);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminProtectedRoute>
            <SecondaryLayout>
              <AdminDashboard />
            </SecondaryLayout>
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
