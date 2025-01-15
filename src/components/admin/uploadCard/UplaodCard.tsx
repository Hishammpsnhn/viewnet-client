import React from "react";
import { useNavigate } from "react-router-dom";

interface UploadCardProps {
  title: string;
  desc: string;
  navigation: string;
}

const UploadCard: React.FC<UploadCardProps> = ({ title, desc, navigation }) => {
  const navigate = useNavigate(); 
  
  return (
    <div className="bg-black text-white shadow-lg rounded-3xl p-6 w-full mx-auto border-b-4 border-x-2 b border-secondary">
      <h2 className="text-xl font-semibold mb-6 text-center capitalize">{title}</h2>
      <div className="flex justify-center mb-4">
        
      </div>
      <div className="flex justify-center">
        <button
          className="px-5 py-2 rounded-3xl bg-white text-black font-bold transition capitalize"
          onClick={() => navigate(navigation)} 
        >
          {desc}
        </button>
      </div>
    </div>
  );
};

export default UploadCard;
