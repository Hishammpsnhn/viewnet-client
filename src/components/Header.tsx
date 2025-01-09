import React from "react";

const Header = () => {
  return (
    <header className="bg-primary text-white py-4 px-8 z-10 ml-16">
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
          <button className="bg-secondary py-2 px-8 rounded-md">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
