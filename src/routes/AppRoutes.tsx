import { Route, Routes, useNavigate } from "react-router-dom";
import { HomePage } from "../pages/user/HomePage";
import MainLayout from "../layouts/MainLayout";
import ProfileCreation from "../pages/user/ProfileCreation";
import EmptyLayout from "../layouts/EmptyLayout";
import Settings from "../pages/user/SettingsPage";
import SecondaryLayout from "../layouts/SecondaryLayout";
import { useEffect, useState } from "react";
import { getME } from "../reducers/userReducer/userThunks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import ProtectedRoute from "./Protected/ProtectedRoute";
import PlansPage from "../pages/user/PlansPage";
import ProfileEditPage from "../pages/user/ProfileEditPage";
import PaymentSuccessPage from "../pages/user/PaymentSuccesPage";
import SearchPage from "../pages/user/SearchPage";
import MovieDetailPage from "../pages/user/MovieDetailPage";
import Details from "../components/Details";
import Related from "../components/Related";
import HistoryPage from "../pages/user/HistoryPage";
import MyPlanPage from "../pages/user/MyplansPage";
import BlockedPage from "../pages/user/BlockPage";
import WatchingPage from "../pages/user/WatchingPage";
import PremiumUserProtectedRoute from "./Protected/PremiumUserProtectedRoute";
import WatchLater from "../pages/user/WatchLater";
import NotFoundPage from "../pages/common/NotFoundPage";
import LivePlayerPage from "../pages/admin/LivePlayerPage";
import { NotificationsPage } from "../pages/user/NotificationPage";
import { useSocket } from "../providers/socketProvider";
import WatchParty from "../pages/user/WatchParty";
const AppRoutes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    if (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken")
    ) {
      setLoading(true);
      dispatch(getME()).finally(() => {
        setLoading(false);
      });
    }
  }, []);
  useEffect(() => {
    if (user && !user.profiles.length) {
      navigate(`/profile/${user._id}`);
    }
    if (user && user._id && socket) {
      socket.emit("register", user._id);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="bg-black h-[100vh] text-white flex items-center justify-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <>
      {loading ? (
        <></>
      ) : (
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
                <SecondaryLayout gradient={true}>
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
            path="/history"
            element={
              <ProtectedRoute>
                <SecondaryLayout>
                  <HistoryPage />
                </SecondaryLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/plans"
            element={
              <SecondaryLayout gradient={true}>
                <PlansPage isAdmin={false} />
              </SecondaryLayout>
            }
          />
          <Route
            path="/blocked"
            element={
              <SecondaryLayout gradient={true}>
                <BlockedPage />
              </SecondaryLayout>
            }
          />
          <Route
            path="/settings/my-plans"
            element={
              <ProtectedRoute>
                <SecondaryLayout gradient={true}>
                  <MyPlanPage />
                </SecondaryLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/watch-later"
            element={
              <ProtectedRoute>
                <SecondaryLayout gradient={true}>
                  <WatchLater />
                </SecondaryLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <SecondaryLayout gradient={true}>
                  <NotificationsPage />
                </SecondaryLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <SecondaryLayout>
                <PaymentSuccessPage />
              </SecondaryLayout>
            }
          />
          <Route
            path="/search"
            element={
              <SecondaryLayout search={true} gradient={true}>
                <SearchPage />
              </SecondaryLayout>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <MainLayout>
                <MovieDetailPage series={false} />
              </MainLayout>
            }
          >
            <Route path="more" element={<Details series={false} />} />
            <Route path="related" element={<Related />} />
          </Route>
          <Route
            path="/series/:id"
            element={
              <MainLayout>
                <MovieDetailPage series={true} />
              </MainLayout>
            }
          >
            <Route path="more" element={<Details series={true} />} />
            <Route path="related" element={<Related />} />
          </Route>
          <Route
            path="/watch"
            element={
              <PremiumUserProtectedRoute>
                <SecondaryLayout gradient={true}>
                  <WatchingPage />
                </SecondaryLayout>
              </PremiumUserProtectedRoute>
            }
          />
          <Route
            path="/live"
            element={
              <PremiumUserProtectedRoute>
                <SecondaryLayout gradient={true}>
                  <LivePlayerPage admin={false} />
                </SecondaryLayout>
              </PremiumUserProtectedRoute>
            }
          />
          <Route
            path="/assets/:id"
            element={
              <PremiumUserProtectedRoute>
                <SecondaryLayout gradient={true}>
                  <LivePlayerPage admin={false} assets={true} />
                </SecondaryLayout>
              </PremiumUserProtectedRoute>
            }
          />
          <Route
            path="/watch-party"
            element={
              // <PremiumUserProtectedRoute>
              <SecondaryLayout gradient={true}>
                <WatchParty />
              </SecondaryLayout>
              // </PremiumUserProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <SecondaryLayout gradient={true}>
                <NotFoundPage />
              </SecondaryLayout>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default AppRoutes;
