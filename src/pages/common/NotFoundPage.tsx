import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-500 mb-4">404</h1>
        <h2 className="text-2xl text-gray-600 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to={"/"}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
