import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { getME } from "../reducers/userReducer/userThunks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import AdminProtectedRoute from "./Protected/AdminProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import MovieUploadPage from "../pages/admin/MovieUploadPage";
import SeriesUploadPage from "../pages/admin/SeriesUploadPage";
import PlansPage from "../pages/user/PlansPage";
import UsersPage from "../pages/admin/UsersPage";
import UploadDetailsPage from "../pages/admin/UploadDetailsPage";
import Player from "../pages/common/Player";

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
      <Route
        path="/users"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <UsersPage/>
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/uploads/details"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <UploadDetailsPage/>
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/watch"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <Player />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
