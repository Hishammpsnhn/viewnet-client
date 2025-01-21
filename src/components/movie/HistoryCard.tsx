import React from "react";
import img from "../../assets/images/MV5BZjRkOTJiZDItY2NjNC00YjJlLTlmN2ItYmNmMDUwODEyNGU2XkEyXkFqcGc@.webp";

const HistoryCard = ({ history }: { history?: boolean }) => {
  const progress = 50;

  return (
    <div className="min-w-52 border border-gray-500 mx-auto bg-primary shadow-md rounded-lg overflow-hidden">
      <div className="flex items-center p-1">
        <img src={img} alt="History Card" className="w-12 h-12 object-cover" />
        <div className="ml-3 text-white">
          <h3 className="text-xs font-semibold">Title</h3>
          <p className="text-sm">Description</p>
        </div>
      </div>
      {history && (
        <div className="p-1">
          <div className="w-full h-1 bg-white rounded-full">
            <div
              className="h-full bg-secondary "
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="p-1">
        <button className="w-full py-1 bg-secondary text-black font-semibold rounded-lg hover:opacity-100 opacity-90 transition duration-200">
          Watch
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;
