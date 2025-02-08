import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import Login from "../features/user/Login";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { searchMovie_API } from "../api/content";
import {
  addSearchingMeta,
  fetchSearching,
  fetchSearchingFailure,
} from "../reducers/movieReducer";

const Header = ({
  search,
  gradient,
}: {
  search?: boolean;
  gradient?: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, selectedProfile } = useSelector(
    (state: RootState) => state.user
  );

  const [loginModal, setLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = () => {
    setLoginModal((prev) => !prev);
  };

  const handleProfileClick = () => {
    console.log("Profile clicked!");
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      console.log("Searching for:", query);
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

  return (
    <header
      className={`${
        gradient ? "bg-gray-900 border-b border-gray-600" : "bg-primary"
      } text-white py-4 px-8 ml-16`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-4">
            <a href="#tvshows" className="hover:text-gray-400">
              TV Shows
            </a>
            <a href="#anime" className="hover:text-gray-400">
              Anime
            </a>
          </nav>
        </div>

        {/* Right Side: Search and Login/Profile */}
        <div className={`flex items-center space-x-4 ${search && "w-5/6"}`}>
          {/* Search Bar */}
          {search && (
            <div className="relative hidden md:block w-full">
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
