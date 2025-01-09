import React from "react";
import { FaSearch, FaCog, FaHome } from "react-icons/fa"; // Import icons

const Sidebar = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-16 h-screen bg-primary flex flex-col justify-between items-center">
        {/* Logo at the top */}
        <div className="mt-4 mb-12">
        <h1 className="text-xl font-bold cursor-pointer text-center tracking-tight leading-5">
            VIEW
            <br />
            <span className="text-sm">NET</span>
          </h1>
        </div>

        {/* Icons Centered Vertically */}
        <div className="flex flex-col items-center justify-center flex-grow space-y-12">
          {/* Home Icon with Text */}
          <div className="relative group flex items-center">
            <FaHome className="text-white text-2xl opacity-85 hover:opacity-100 hover:ml-1" />
            <div className="absolute left-full  hidden group-hover:block text-white bg-primary px-10 py-2 rounded-r-md transform translate-x-8 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 animate-fade-right animate-once animate-ease-in-out animate-normal">
              Home
            </div>
          </div>

          {/* Search Icon with Text */}
          <div className="relative group flex items-center">
            <FaSearch className="text-white text-2xl opacity-85 hover:opacity-100 hover:ml-1" />
            <div className="absolute left-full  hidden group-hover:block text-white bg-primary px-10 py-2 rounded-r-md transform translate-x-8 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 animate-fade-right animate-once animate-ease-in-out animate-normal">
              Search
            </div>
          </div>

          {/* Settings Icon with Text */}
          <div className="relative group flex items-center">
            <FaCog className="text-white text-2xl opacity-85 hover:opacity-100 hover:ml-1" />
            <div className="absolute left-full hidden group-hover:block text-white bg-primary px-10 py-2 rounded-r-md transform translate-x-8 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 animate-fade-right animate-once animate-ease-in-out animate-normal">
              Settings
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
