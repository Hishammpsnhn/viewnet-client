import React from "react";
import { AiOutlineArrowUp } from "react-icons/ai"; // Importing the arrow up icon

const NumberCard: React.FC = () => {
  return (
    <div className="bg-primary text-gra shadow-lg rounded-xl px-8 py-5 max-w-4xl mx-auto w-full">
      <h6 className="text-sm font-semibold text-center text-gray-600">
        Upload And Publish Movie
      </h6>

      <h6 className="text-2xl font-semibold text-gray-600">1800</h6>
      <div className="border-b-2 border-gray-700 my-2"></div>
      <h6 className="text-s font-semibold text-gray-600 flex items-center">
        <AiOutlineArrowUp className="text-green-500 mr-2" /> + 19 users/day
      </h6>
    </div>
  );
};

export default NumberCard;
