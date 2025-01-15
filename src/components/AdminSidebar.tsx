import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaCogs,
  FaShoppingCart,
} from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-r from-[#050505] to-[#0590c21c] bg-opacity-10 border-r border-secondary text-white p-5 flex flex-col py-10">
        <h2 className="text-2xl font-semibold mb-4">Admin Sidebar</h2>
        <div className="border-b-2 border-gray-700 mb-8"></div>
        <ul className="flex flex-col space-y-4 ">
          <li>
            <a
              href="#"
              className="flex items-center py-3 px-4 hover:border hover:border-secondary  hover:bg-gradient-to-br hover:from-[#00b9ad2d] hover:to-[#00b9ad43]  rounded-lg font-semibold"
            >
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center py-3 px-4 hover:border hover:border-secondary hover:bg-gradient-to-br hover:from-[#00b9ad2d] hover:to-[#00b9ad43]  rounded-lg font-semibold"
            >
              <FaUsers className="mr-3" />
              Users
            </a>
          </li>
          <li>
            <a
              href="#"
             className="flex items-center py-3 px-4 hover:border hover:border-secondary hover:bg-gradient-to-br hover:from-[#00b9ad2d] hover:to-[#00b9ad43]  rounded-lg font-semibold"
            >
              <FaShoppingCart className="mr-3" />
              Orders
            </a>
          </li>
          <li>
            <a
              href="#"
             className="flex items-center py-3 px-4 hover:border hover:border-secondary hover:bg-gradient-to-br hover:from-[#00b9ad2d] hover:to-[#00b9ad43]  rounded-lg font-semibold"
            >
              <FaBox className="mr-3" />
              Products
            </a>
          </li>
          <li>
            <a
              href="#"
               className="flex items-center py-3 px-4 hover:border hover:border-secondary hover:bg-gradient-to-br hover:from-[#00b9ad2d] hover:to-[#00b9ad43]  rounded-lg font-semibold"
            >
              <FaCogs className="mr-3" />
              Settings
            </a>
          </li>
        </ul>
        <div className="border-b-2 border-gray-700  mt-auto"></div>
        <button className="bg-secondary px-5 py-3 rounded-xl mt-auto">
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
