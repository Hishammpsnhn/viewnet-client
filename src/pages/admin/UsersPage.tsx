import React, { useEffect, useState } from "react";
import {
  GETAllUsers_API,
  GETUserPlanDetails_API,
} from "../../api/user/userApi";
import PlanDetailModal from "../../components/PlanDetailModal"; // Import the PlanDetailModal component
import { Subscription } from "../../model/types/user.types";
import { toast, ToastContainer } from "react-toastify";

interface User {
  _id: string;
  email: string;
  isBlocked: boolean;
  profilesCount: number;
  sessionsCount: number;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserPlan, setSelectedUserPlan] = useState<Subscription | null>(
    null
  );

  console.log(selectedUserPlan);

  const handlePlanDetails = async (userId: string) => {
    const data = await GETUserPlanDetails_API(userId);
    console.log(data);
    if (data.success) {
      if (data.userPlan) {
        setSelectedUserPlan(data.userPlan);
      } else {
        toast.error("User does not have a subscription.");
      }
    }
  };

  const closeModal = () => {
    setSelectedUserPlan(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await GETAllUsers_API();
      if (users.success) {
        setUsers(users.users);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-secondary">
          <thead>
            <tr>
              <th className="border border-secondary px-4 py-5">ID</th>
              <th className="border border-secondary px-4 py-5">User Email</th>
              <th className="border border-secondary px-4 py-5">
                Profile Count
              </th>
              <th className="border border-secondary px-4 py-5">
                Login Device
              </th>
              <th className="border border-secondary px-4 py-5">
                Plan Details
              </th>
              <th className="border border-secondary px-4 py-5">
                Block/Unblock
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border border-secondary px-4 py-2">
                  {user._id}
                </td>
                <td className="border border-secondary px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-secondary px-4 py-2">
                  {user.profilesCount}
                </td>
                <td className="border border-secondary px-4 py-2">
                  {user.sessionsCount}
                </td>
                <td className="border border-secondary px-4 py-2">
                  <button
                    onClick={() => handlePlanDetails(user._id)}
                    className="px-4 py-2 rounded-md bg-secondary"
                  >
                    Get Plan Details
                  </button>
                </td>
                <td className="border border-secondary px-4 py-2">
                  <button
                    className={`px-4 py-2 rounded-md ${
                      user.isBlocked
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedUserPlan && (
        <PlanDetailModal
          // isOpen={planDetailModal}
          planDetails={selectedUserPlan}
          closeModal={closeModal}
        />
      )}
      <ToastContainer theme="dark"/>
    </div>
  );
};

export default UsersPage;
