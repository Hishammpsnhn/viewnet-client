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
import SeriesManagement from "../pages/admin/SeriesManagement";
import GenrePage from "../pages/admin/GenrePage";
import PaymentPage from "../pages/admin/PaymentsPage";
import NotFoundPage from "../pages/common/NotFoundPage";
import LivePage from "../pages/admin/LivePage";
import LivePlayerPage from "../pages/admin/LivePlayerPage";

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
              <PlansPage isAdmin={true} />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/series/:seriesId"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <SeriesManagement />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <UsersPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/uploads/details"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <UploadDetailsPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/genre"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <GenrePage />
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
      <Route
        path="/payment-history"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <PaymentPage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/dashboard/live"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <LivePage />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/live"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <LivePlayerPage admin={true} />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <AdminLayout>
            <NotFoundPage />
          </AdminLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
