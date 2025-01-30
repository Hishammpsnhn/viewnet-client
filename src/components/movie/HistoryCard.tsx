import React from "react";
import { useNavigate } from "react-router-dom";

interface HistoryCardProps {
  title: string;
  image: string;
  description: string;
  id:string
  history?: boolean;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ title, image, description, history,id }) => {
  const progress = 50;
  const navigate = useNavigate()

  return (
    <div className="min-w-52 border border-gray-500 mx-auto bg-primary shadow-md rounded-lg overflow-hidden">
      <div className="flex items-center p-1">
        <img src={image} alt={title} className="w-12 h-12 object-cover" />
        <div className="ml-3 text-white">
          <h3 className="text-xs font-semibold">{title}</h3>
          <p className="text-sm">{description}</p>
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
        <button className="w-full py-1 bg-secondary text-black font-semibold rounded-lg hover:opacity-100 opacity-90 transition duration-200" onClick={()=> navigate(`/watch?v=${id}`)} >
          Watch
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;
