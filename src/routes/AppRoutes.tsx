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


const AppRoutes = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getME());
  }, []);
  return (
    <BrowserRouter>
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
            <EmptyLayout>
              <ProfileCreation />
            </EmptyLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <SecondaryLayout>
              <Settings />
          </SecondaryLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
