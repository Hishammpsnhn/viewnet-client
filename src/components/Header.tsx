import React, { useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import Login from "../features/user/Login";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { searchMovie_API } from "../api/content";
import { CiBellOn } from "react-icons/ci";
import { useSocket } from "../providers/socketProvider";
import {
  addSearchingMeta,
  fetchSearching,
  fetchSearchingFailure,
} from "../reducers/movieReducer";
import { useNavigate } from "react-router-dom";
import { GetNotificationCount_API } from "../api/notificationApi";

const Header = ({
  search,
  gradient,
}: {
  search?: boolean;
  gradient?: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications } = useSocket();
  const navigate = useNavigate();

  const { user, selectedProfile } = useSelector(
    (state: RootState) => state.user
  );

  const [loginModal, setLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogin = () => {
    setLoginModal((prev) => !prev);
  };

  const handleProfileClick = () => {
    navigate("/settings")
  };

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      dispatch(fetchSearching());
      try {
        const res = await searchMovie_API(query);
        if (res.success) {
          dispatch(addSearchingMeta(res.data));
        }
      } catch (error) {
      } finally {
        dispatch(fetchSearchingFailure());
      }
    }, 500),
    []
  );

  // Handle input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };
  useEffect(() => {
    async function fetchNotificationCount() {
      if (user) {
        const res = await GetNotificationCount_API(user._id);
        if (res.success) {
          setNotificationCount(notifications.length + res.data);
        }
      }
    }
    fetchNotificationCount();
  }, [notifications]);
  return (
    <header
      className={`${
        gradient ? "bg-gray-900 border-b border-gray-600" : "bg-primary"
      } text-white py-3 px-4 sm:4 sm:8 ml-16 relative`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Logo and Navigation */}
        <div className=" hidden  lg:flex  items-center space-x-6 ">
          <nav className=" space-x-4">
            <a href="#tvshows" className="hover:text-gray-400">
              TV Shows
            </a>
            <a href="#anime" className="hover:text-gray-400">
              Anime
            </a>
          </nav>
        </div>

        {/* Right Side: Search, Notifications, and Login/Profile */}
        <div className={`flex items-center space-x-4 ${search && "w-5/6"}`}>
          {/* Search Bar */}
          {search && (
            <div className="relative block w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary w-full"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                🔍
              </button>
            </div>
          )}

          {/* Notifications */}
          {user && (
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <CiBellOn className="w-6 h-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-700 flex justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <span
                      className="text-gray-600 cursor-pointer text-xs"
                      onClick={() => navigate("/notifications")}
                    >
                      more
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length  === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        No new notifications
                      </p>
                    ) : (
                      notifications.slice(0, 5).map((notification, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <p className="font-medium">{notification.message}</p>
                          {/* <p className="text-sm text-gray-400">
                            {notification.data.creator}
                          </p> */}
                          {/* <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p> */}
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 5 && (
                    <div className="px-4 py-2 border-t border-gray-700">
                      <button
                        onClick={() => {
                          /* Add navigation to notifications page */
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm w-full text-center"
                      >
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Login or Profile */}
          {!user ? (
            <button
              className="bg-secondary py-2 text-black font-bold px-8 rounded-md"
              onClick={handleLogin}
            >
              Login
            </button>
          ) : (
            <img
              src={selectedProfile?.profilePic || "/default-profile.png"}
              alt={`Profile`}
              onClick={handleProfileClick}
              className={`rounded-full border-2 object-cover cursor-pointer
                w-10 h-10 border-secondary
              `}
            />
          )}
        </div>
      </div>
      {/* Login Modal */}
      <Login login={loginModal} />
    </header>
  );
};

export default Header;
