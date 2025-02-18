import React, { useEffect, useState } from "react";
import { GetActive_API } from "../api/notificationApi";
interface PeekHour{
    hour: number;
    count: number;
}
const HeatMap = () => {
 
  const currentHour = new Date().getHours();
  console.log(currentHour);
  const [heatMapData,setHeatMapData] = useState<PeekHour[]>([])
  
  
  const getColorClass = (count: number) => {
    const maxCount = Math.max(...heatMapData.map((d) => d.count));
    const percentage = (count / maxCount) * 100;
    if (percentage >= 80) return "bg-blue-900 text-white";
    if (percentage >= 60) return "bg-blue-700 text-white";
    if (percentage >= 40) return "bg-blue-500 text-white";
    if (percentage >= 20) return "bg-blue-300 text-black";
    return "bg-blue-100 text-black";
  };

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}${ampm}`;
  };

  useEffect(() => {
    const fetchHeatmapData = async() => {
      const res =await GetActive_API();
      if(res.success){
        setHeatMapData(res.data);
      }
    };
    fetchHeatmapData();
  }, []);

  return (
    <div className="w-full max-w-4xl p-6 bg-primary rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Peek Hours
      </h2>
      <div className="grid grid-cols-6 gap-2 md:grid-cols-4 lg:grid-cols-4  ">
        {heatMapData.map((data:PeekHour) => (
          <div
            key={data.hour}
            className={`p-1 transition-colors duration-200 ${getColorClass(
              data.count
            )}`}
          >
            <div className="text-xs font-medium">{formatHour(data.hour)}</div>
            <div className="text-xs font-bold">{data.count}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">Low Activity</div>
        <div className="flex gap-2">
          <div className="w-6 h-6 bg-blue-100 rounded"></div>
          <div className="w-6 h-6 bg-blue-300 rounded"></div>
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
          <div className="w-6 h-6 bg-blue-700 rounded"></div>
          <div className="w-6 h-6 bg-blue-900 rounded"></div>
        </div>
        <div className="text-sm text-gray-600">High Activity</div>
      </div>
    </div>
  );
};

export default HeatMap;
