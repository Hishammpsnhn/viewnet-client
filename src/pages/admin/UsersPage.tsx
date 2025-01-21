import React, { useEffect, useState } from "react";
import {
  GETAllUsers_API,
  GETUserPlanDetails_API,
  UpdateUser_API,
} from "../../api/user/userApi";
import PlanDetailModal from "../../components/PlanDetailModal";
import { Subscription } from "../../model/types/user.types";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDialog from "../../components/ConfirmDialog";

interface User {
  _id: string;
  email: string;
  isBlock: boolean;
  profilesCount: number;
  sessionsCount: number;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserPlan, setSelectedUserPlan] = useState<Subscription | null>(
    null
  );

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirmAction = async () => {
    if (selectedUser) {
      const data = await UpdateUser_API(selectedUser._id, {
        isBlock: !selectedUser.isBlock,
      });
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === data.user._id ? { ...u, isBlock: data.user.isBlock } : u
          )
        );
        toast.success("User updated successfully.");
      }
    }
    setOpen(false); 
  };

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

  const handleUpdateUser = (user: User) => {
    setSelectedUser(user); 
    setOpen(true); 
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
                    onClick={() => handleUpdateUser(user)}
                    className={`px-4 py-2 rounded-md ${
                      user.isBlock
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {user.isBlock ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={open}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAction}
        message={"Are you sure you want to change the user's status?"}
      />

      {/* Modal */}
      {selectedUserPlan && (
        <PlanDetailModal
          planDetails={selectedUserPlan}
          closeModal={closeModal}
        />
      )}
      <ToastContainer theme="dark" />
    </div>
  );
};

export default UsersPage;
