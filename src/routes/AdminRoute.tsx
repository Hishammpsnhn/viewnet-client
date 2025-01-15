import { Route, Routes } from "react-router-dom";
import SecondaryLayout from "../layouts/SecondaryLayout";
import { useEffect } from "react";
import { getME } from "../reducers/authReducers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import AdminProtectedRoute from "./Protected/AdminProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import MovieUploadPage from "../pages/admin/MovieUploadPage";
import SeriesUploadPage from "../pages/admin/SeriesUploadPage";
import PlansPage from "../pages/user/PlansPage";

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
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/upload/movie"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <MovieUploadPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/upload/series"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <SeriesUploadPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/plans"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <PlansPage isAdmin={true}/>
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
