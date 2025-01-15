import React from "react";
import img from "../../assets/images/MV5BZjRkOTJiZDItY2NjNC00YjJlLTlmN2ItYmNmMDUwODEyNGU2XkEyXkFqcGc@.webp";

const HistoryCard = () => {
  return (
    <div className="w-full mx-auto bg-primary shadow-md rounded-lg overflow-hidden">
      <div className="flex items-center p-3">
        <img
          src={img}
          alt="History Card"
          className="w-12 h-12 object-cover  "
        />
        <div className="ml-3 text-white">
          <h3 className="text-xs font-semibold">Title</h3>
          <p className=" text-sm">Description</p>
        </div>
      </div>
      <div className="p-3">
        <button className="w-full py-2 bg-secondary text-black font-semibold rounded-lg hover:opacity-100 opacity-90 transition duration-200">
          Watch
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;
