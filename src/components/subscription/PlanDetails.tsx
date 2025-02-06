import React from "react";
import { UserPlan } from "../../model/types/plan.types";

interface PlanDetailsProps {
  planData: UserPlan;
}

const PlanDetails: React.FC<PlanDetailsProps> = ({ planData }) => {
  if (!planData) {
    return (
      <p className="text-center text-gray-500 text-sm mt-4">
        No plan details available.
      </p>
    );
  }

  const { plan, startDate, endDate, status, sessionLimit, ads, live, uhd } =
    planData;

  const statusClasses = {
    active: "bg-green-100 text-green-600",
    queued: "bg-yellow-100 text-yellow-600",
    inactive: "bg-red-100 text-red-600",
  };

  return (
    <div className="w-full mx-auto bg-gray-800 border border-gray-700 shadow-sm rounded-lg p-4 mt-4">
      <h2 className="text-xl font-semibold text-white mb-2">{plan}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Purchase Date</span>
          <span className="text-sm text-gray-200">
          {new Date(startDate).toLocaleDateString('en-GB')}
          </span>
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">End Date</span>
          <span className="text-sm text-gray-200">
            {new Date(endDate).toLocaleDateString("en-GB")}
          </span>
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Status</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${statusClasses[status]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        {/* Session Limit */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Session Limit</span>
          <span className="text-sm text-gray-200">{sessionLimit}</span>
        </div>
      </div>

      {/* Ads, Live, UHD in a single row, only if they exist */}
      <div className="flex space-x-4 mt-4">
        {/* Ads */}
        {ads && (
          <div className="flex flex-col">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                ads ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
            >
              Ad-Free
            </span>
          </div>
        )}

        {/* Live */}
        {live && (
          <div className="flex flex-col">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                live ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
            >
              Live Streaming
            </span>
          </div>
        )}

        {/* UHD */}
        {uhd && (
          <div className="flex flex-col">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                uhd ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
            >
              4K
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDetails;
