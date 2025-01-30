import React from "react";

const HistoryCardSkeleton: React.FC = () => {
  return (
    <div className="min-w-52 border border-gray-500 mx-auto bg-primary shadow-md rounded-lg overflow-hidden animate-pulse">
      <div className="flex items-center p-1">
        <div className="w-12 h-12 bg-gray-700 rounded-md"></div>
        <div className="ml-3">
          <div className="w-20 h-3 bg-gray-600 rounded-md"></div>
          <div className="w-32 h-2 bg-gray-700 rounded-md mt-1"></div>
        </div>
      </div>
      <div className="p-1">
        <div className="w-full h-1 bg-gray-600 rounded-full">
          <div className="h-full bg-gray-500"></div>
        </div>
      </div>
      <div className="p-1">
        <div className="w-full py-2 bg-gray-600 rounded-lg"></div>
      </div>
    </div>
  );
};

export default HistoryCardSkeleton;
