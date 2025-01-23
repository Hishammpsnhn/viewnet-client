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
import GenericTable from "../../components/GenericTable";

interface User {
  _id: string;
  email: string;
  isBlock: boolean;
  profilesCount: number;
  sessionsCount: number;
}
interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery,setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserPlan, setSelectedUserPlan] = useState<Subscription | null>(
    null
  );

  const handleCloseDialog = () => setOpen(false);

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
    if (data.success) {
      if (data.userPlan) {
        setSelectedUserPlan(data.userPlan);
      } else {
        toast.error("User does not have a subscription.");
      }
    }
  };

  const closeModal = () => setSelectedUserPlan(null);

  const handleUpdateUser = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };
 
  useEffect(() => {
    const fetchUsers = async () => {
      if(searchQuery != ""){
        setPage(1)
      }
      const users = await GETAllUsers_API(page,5,searchQuery);
      if (users.success) {
        setUsers(users.users);
      }
    };
    fetchUsers();
  }, [page,searchQuery]);

  const columns: Column<User>[] = [
    { header: "ID", accessor: "_id" },
    { header: "Email", accessor: "email" },
    { header: "Profile Count", accessor: "profilesCount" },
    { header: "Login Device", accessor: "sessionsCount" },
    {
      header: "Plan Details",
      accessor: (user: User) => (
        <button
          onClick={() => handlePlanDetails(user._id)}
          className="px-4 py-2 rounded-md bg-secondary"
        >
          Get Plan Details
        </button>
      ),
    },
    {
      header: "Block/Unblock",
      accessor: (user: User) => (
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
      ),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          className="bg-black border-secondary p-2 text-lg my-5 border rounded-md"
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
        />

      </div>
      <GenericTable<User> data={users} columns={columns} />
      <div className="flex justify-between">
        <button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
        <button disabled={users.length < 5} onClick={() => setPage((prev) => prev + 1)}>next</button>
      </div>

      <ConfirmDialog
        open={open}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAction}
        message={"Are you sure you want to change the user's status?"}
      />

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
