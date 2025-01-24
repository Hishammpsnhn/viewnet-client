import React, { useEffect, useState } from "react";
import {
  GETAllUsers_API,
  GETUserPlanDetails_API,
  UpdateUser_API,
} from "../../api/userApi";
import PlanDetailModal from "../../components/PlanDetailModal";
import { Subscription } from "../../model/types/user.types";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDialog from "../../components/ConfirmDialog";
import GenericTable from "../../components/GenericTable";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import LoadingSpinner from "../../components/LoadingSpinner";
import { UserPlan } from "../../model/types/plan.types";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedUserPlan, setSelectedUserPlan] = useState<UserPlan | null>(
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
    if ( data && data.success) {
      if (data.userPlan.length) {
        setSelectedUserPlan(data.userPlan[0]);
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
      if (searchQuery != "") {
        setPage(1);
      }
      setLoading(true);
      try {
        const users = await GETAllUsers_API(page, 5, searchQuery);
        if (users.success) {
          setUsers(users.users);
        }
      } catch (error) {
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, searchQuery]);

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
      {loading ? (
        <LoadingSpinner />
      ) : (
        <GenericTable<User> data={users} columns={columns} />
      )}
      <div className="flex justify-end mt-5">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={`bg-slate-400 p-2 rounded-sm mr-3 ${
            page <= 1 && "opacity-60"
          }`}
        >
          <IoIosArrowBack />{" "}
        </button>
        <button
          disabled={users.length < 5}
          onClick={() => setPage((prev) => prev + 1)}
          className={`bg-slate-400 p-2 rounded-sm  ${
            users.length < 5 && "opacity-60"
          }`}
        >
          <IoIosArrowForward />
        </button>
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
