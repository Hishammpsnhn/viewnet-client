import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaCogs,
  FaShoppingCart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Logout_API } from "../api/userApi";
import { logout } from "../reducers/userReducer/userReducers";

import { useDispatch } from "react-redux";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const res = await Logout_API();
    if (res.success) {
      dispatch(logout());
      window.location.reload()
    }
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-r from-[#050505] to-[#0590c21c] bg-opacity-10 border-r border-secondary text-white p-5 flex flex-col py-10">
        <h2 className="text-2xl font-semibold mb-4">Admin Sidebar</h2>
        <div className="border-b-2 border-gray-700 mb-8"></div>
        <ul className="flex flex-col space-y-4 ">
          <li>
            <button
              onClick={() => navigate("/")}
              className="flex items-center py-3 px-4 hover:border w-full hover:border-secondary  hover:bg-gradient-to-br hover:from-[#00b9ad2d] hover:to-[#00b9ad43]  rounded-lg font-semibold"
            >
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/users")}
              className="flex items-center py-3 px-4 hover:border hover:border-secondary hover:bg-gradient-to-br hover:from-[#00b9ad2d] hover:to-[#00b9ad43]  rounded-lg font-semibold w-full"
            >
              <FaUsers className="mr-3" />
              Users
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/plans")}
              className="flex items-center py-3 px-4 hover:border hover:border-secondary hover:bg-gradient-to-br hover:from-[#00b9ad2d] hover:to-[#00b9ad43] w-full  rounded-lg font-semibold"
            >
              <FaShoppingCart className="mr-3" />
              Plans
            </button>
          </li>
          <li>
            <button className="flex items-center py-3 px-4 hover:border hover:border-secondary hover:bg-gradient-to-br hover:from-[#00b9ad2d] hover:to-[#00b9ad43]  rounded-lg font-semibold w-full" onClick={()=>navigate("/uploads/details")}>
              <FaBox className="mr-3" />
              Movies
            </button>
          </li>
          <li>
            <button className="flex items-center w-full py-3 px-4 hover:border hover:border-secondary hover:bg-gradient-to-br hover:from-[#00b9ad2d] hover:to-[#00b9ad43]  rounded-lg font-semibold">
              <FaCogs className="mr-3" />
              Settings
            </button>
          </li>
        </ul>
        <div className="border-b-2 border-gray-700  mt-auto"></div>
        <button
          className="bg-secondary px-5 py-3 rounded-xl mt-auto"
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
