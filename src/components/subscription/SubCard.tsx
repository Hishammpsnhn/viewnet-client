import React from 'react';

interface SubCardProps {
  name: string;
  price: string;
  discount?: number;
  features: string[];
  onEdit: () => void; // New prop to handle the edit button click
}

const SubCard: React.FC<SubCardProps> = ({ name, price, discount, features, onEdit }) => {
  return (
    <div className="bg-gray-800 shadow-2xl rounded-lg p-8 max-w-lg mx-auto">
      <button onClick={onEdit} className="text-white bg-blue-500 p-2 rounded">
        Edit
      </button>
      <h2 className="text-3xl font-bold text-white mb-4">{name}</h2>
      <div className="flex items-center justify-between mb-6">
        <span className="text-4xl font-semibold text-yellow-400">${price}</span>
        {discount && (
          <span className="bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="text-white flex items-center">
            <svg
              className="w-6 h-6 text-green-500 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button className="w-full bg-secondary opacity-80 text-white p-2 rounded-lg hover:opacity-100 transition duration-300 text-xl">
        Subscribe Now
      </button>
    </div>
  );
};

export default SubCard;
