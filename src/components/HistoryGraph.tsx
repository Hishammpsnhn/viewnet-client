import React, { useEffect, useState } from "react";
import { GetWatchTime_API } from "../api/notificationApi";
import { useSelector } from "react-redux";
import { RootState } from "../store";
// import { Clock } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GraphData {
  day: string;
  watchTime: number;
}

const HistoryGraph = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [data, setData] = useState<GraphData[]>([]);
  const [totalHours, setTotalHours] = useState(0);

  const fetchWatchTime = async () => {
    if (!user) return;
    const res = await GetWatchTime_API(user.defaultProfile);
    if (res.success) {
      setData(res.data);
      const total = res.data.reduce((acc:number, curr:GraphData) => acc + curr.watchTime, 0);
      console.log(total)
      setTotalHours(Math.round(total));
    }
  };

  useEffect(() => {
    fetchWatchTime();
  }, [user]);

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const hours = context.raw;
            if (hours < 1) return `${Math.round(hours * 60)} minutes`;
            return hours === 1 ? "1 hour" : `${hours} hours`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            if (value < 1) return `${Math.round(value * 60)}m`;
            return `${value}h`;
          },
        },
        grid: {
          color: 'rgba(105, 118, 235, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Chart.js data
  const chartData = {
    labels: data.map(item => item.day),
    datasets: [
      {
        data: data.map(item => item.watchTime),
        backgroundColor: 'rgba(105, 118, 235, 0.8)',
        hoverBackgroundColor: 'rgba(105, 118, 235, 1)',
        borderRadius: 6,
        maxBarThickness: 40,
      },
    ],
  };

  return (
    <div className="max-w-2xl w-full rounded-lg shadow bg-white dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center me-3">
            {/* <Clock className="w-6 h-6 text-blue-600 dark:text-blue-300" /> */}
          </div>
          <div>
            <h5 className="leading-none text-2xl font-bold text-gray-900 dark:text-white pb-1">
              {totalHours}
            </h5>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              hours this week
            </p>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <Bar options={options} data={chartData} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <button
          className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
        >
          Last 7 days
        </button>
      </div>
    </div>
  );
};

export default HistoryGraph;