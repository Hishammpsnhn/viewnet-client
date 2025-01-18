import React, { useState } from "react";
import Login from "../features/user/Login";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Header = () => {
  const [loginModal, setLoginModal] = useState(false);
  const { user, selectedProfile } = useSelector(
    (state: RootState) =>  state.user
  );
  console.log(selectedProfile);
  const handleLogin = () => {
    setLoginModal((prev) => !prev);
  };
  return (
    <header className="bg-primary text-white py-4 px-8  ml-16">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Logo and Navigation */}
        <div className="flex items-center space-x-6">
          {/* Navigation: Hidden on mobile */}
          <nav className="hidden md:flex space-x-4">
            <a href="#tvshows" className="hover:text-gray-400">
              TV Shows
            </a>
            <a href="#anime" className="hover:text-gray-400">
              Anime
            </a>
          </nav>
        </div>

        {/* Right Side: Search and Login */}
        <div className="flex items-center space-x-4">
          {/* Search Bar: Hidden on mobile */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
              🔍
            </button>
          </div>

          {/* Login Button */}
          {!user ? (
            <>
              <button
                className="bg-secondary py-2 text-black font-bold px-8 rounded-md"
                onClick={handleLogin}
              >
                Login
              </button>
            </>
          ) : (
            <img
              src={selectedProfile?.profilePic}
              alt={`Profile`}
              // onClick={() => handleChangeProfile(item._id)}
              className={`rounded-full border-2 object-cover cursor-pointer 
                w-10 h-10 border-secondary
                `}
            />
          )}
        </div>
      </div>
      <Login login={loginModal} />
    </header>
  );
};

export default Header;
