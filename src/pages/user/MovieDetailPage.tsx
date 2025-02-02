import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import Carousel from "../../components/Carousel";
import { fetchSeriesDetails_API, getSeriesDetails_API } from "../../api/content";

const MovieDetailPage = () => {

  const { id } = useParams();
  

  return (
    <div className="">
      {/* Carousel Section */}
      <Carousel />

      {/* Tab Navigation */}
      <div className="mt-6 mx-14">
        <nav className="flex space-x-4 text-xl font-medium">
          <NavLink
            to="more"
            className={({ isActive }) =>
              isActive
                ? "text-secondary  underline  font-semibold border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-600"
            }
          >
            Details
          </NavLink>
          <NavLink
            to="related"
            className={({ isActive }) =>
              isActive
                ? "text-secondary underline font-semibold border-b-2 border-primary"
                : "text-gray-500  hover:text-gray-600"
            }
          >
            Related
          </NavLink>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4 ml-16">
        <Outlet />
      </div>
    </div>
  );
};

export default MovieDetailPage;
