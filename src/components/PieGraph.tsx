import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { getUsersPlansCount } from '../api/PlansApi';

interface SubscriptionData {
  _id: string;
  value: number;
}

// Predefined color palette
const colorPalette = [
  'rgba(54, 162, 235, 0.8)',   // Blue
  'rgba(75, 192, 192, 0.8)',   // Teal
  'rgba(255, 159, 64, 0.8)',   // Orange
  'rgba(153, 102, 255, 0.8)',  // Purple
  'rgba(255, 205, 86, 0.8)',   // Yellow
  'rgba(201, 203, 207, 0.8)',  // Gray
  'rgba(106, 76, 147, 0.8)',   // Deep Purple
  'rgba(46, 204, 113, 0.8)',   // Green
  'rgba(231, 76, 60, 0.8)',    // Red
];

// Function to get colors from palette
const getColors = (count: number) => {
  // If we need more colors than in our palette, cycle through them
  return Array.from({ length: count }, (_, index) => colorPalette[index % colorPalette.length]);
};

const PieGraph: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [pieData, setPieData] = useState<SubscriptionData[]>([]);
  const colors = getColors(pieData.length);

  // Transform data for Chart.js format
  const chartData: ChartData<'doughnut'> = {
    labels: pieData.map((item) => item._id),
    datasets: [
      {
        data: pieData.map((item) => item.value),
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace('0.8', '1')), // Darker border
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const total = pieData.reduce((sum, item) => sum + item.value, 0);
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toLocaleString()} users (${percentage}%)`;
          },
        },
      },
    },
    cutout: '50%',
  };

  useEffect(() => {
    if (!chartRef.current) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: options,
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [pieData]);

  const totalUsers = pieData.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    const chartData = async () => {
      const data = await getUsersPlansCount();
      setPieData(data?.data);
    };
    chartData();
  }, []);

  return (
    <div className="w-full max-w-md bg-primary rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Subscription Plan Distribution
        </h2>
        {pieData.length > 0 ? (
          <div className="w-full flex flex-col items-center">
            <div className="w-full relative">
              <canvas ref={chartRef}></canvas>
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-gray-700">
                Total Users: {totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </div>
    </div>
  );
};

export default PieGraph;