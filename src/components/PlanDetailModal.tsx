import React from "react";
import { Subscription } from "../model/types/user.types";

interface PlanDetailModalProps {
  planDetails: Subscription;
  closeModal: () => void;
}

const PlanDetailModal: React.FC<PlanDetailModalProps> = ({
  planDetails,
  closeModal,
}) => {
  const {
    plan,
    startDate,
    endDate,
    status,
    sessionLimit,
  } = planDetails;
  const currentDate = new Date();
  const endDateObj = new Date(endDate);
  const timeDiff = endDateObj.getTime() - currentDate.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black border border-secondary p-6 rounded-lg shadow-lg w-96 text-gray-300 relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Plan Details
        </h2>
        <h2 className="text-xl text-red-800 font-semibold mb-4 text-center">{daysLeft} Days Left</h2>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Plan Name:</h3>
            <p className="text-sm">{plan}</p>
          </div>
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Status:</h3>
            <p className="text-sm">{status}</p>
          </div>
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Session Limit:</h3>
            <p className="text-sm">{sessionLimit}</p>
          </div>
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Start Date:</h3>
            <p className="text-sm">
              {new Date(startDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">End Date:</h3>
            <p className="text-sm">{new Date(endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailModal;
