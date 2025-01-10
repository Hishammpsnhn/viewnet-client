import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/user/HomePage";
import MainLayout from "../layouts/MainLayout";
import ProfileCreation from "../pages/user/ProfileCreation";
import EmptyLayout from "../layouts/EmptyLayout";
import Settings from "../pages/user/SettingsPage";
import SecondaryLayout from "../layouts/secondaryLayout";

const AppRoutes = () => {
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
          path="/profile"
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
