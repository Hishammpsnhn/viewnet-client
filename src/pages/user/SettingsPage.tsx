import { useEffect, useState } from "react";
import { FaPlus, FaSignOutAlt } from "react-icons/fa"; // Import logout icon
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import NewProfile from "../../features/user/NewProfile";
import {
  getME,
  updateDefaultProfile,
} from "../../reducers/userReducer/userThunks";
import { useNavigate } from "react-router-dom";
import { logout } from "../../reducers/userReducer/userReducers";
import { GETUserPlanDetails_API, Logout_API } from "../../api/user/userApi";
import { UserPlan } from "../../model/types/plan.types";
import PlanDetails from "../../components/subscription/PlanDetails";
// import { logout } from "../../reducers/userReducer/userActions"; // Assuming you have a logout action

const Settings = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [selectedProfile, setSelectedProfile] = useState(
    user.user?.defaultProfile
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleChangeProfile = (defaultProfile: string) => {
    if (user.user) {
      dispatch(
        updateDefaultProfile({ userId: user.user?._id, defaultProfile })
      );
      navigate("/");
    }
  };

  const handleLogout = async () => {
    const res = await Logout_API();
    if (res.success) {
      dispatch(logout());
      navigate("/");
    }
  };

  useEffect(() => {
    if (!selectedProfile && user.user?.defaultProfile) {
      setSelectedProfile(user.user.defaultProfile);
    }
  }, [user.user?.defaultProfile, selectedProfile]);

  return (
    <div className="px-10 py-5 bg-gradient-to-b  to-primary from-gray-900" >
      <div>
        <h2 className="text-2xl font-semibold mb-5">Settings</h2>
        <div className="flex justify-between mb-5 align-center">
          <h2>
            Subscribe to enjoy View
            <br />
            Net
          </h2>
          <button
            className="px-3 py-2 mt-6 text-lg bg-secondary text-black font-semibold text-sm rounded-md my-auto opacity-90 hover:opacity-100"
            onClick={() => navigate("/plans")}
          >
            Subscribe
          </button>
        </div>
        <div className="bg-gray-600 w-full h-0.5 mt-4 mb-8"></div>
        <div className="flex justify-between">
          <div className="flex gap-4 items-center">
            {user.user?.profiles.map((item, index) => (
              <img
                key={item._id}
                src={item.profilePic}
                alt={`Profile ${item.username + 1}`}
                onClick={() => handleChangeProfile(item._id)}
                className={`rounded-full border-2 object-cover cursor-pointer ${
                  selectedProfile === item._id
                    ? "w-20 h-20 border-secondary"
                    : "w-16 h-16 border-black"
                }`}
              />
            ))}
            <button
              onClick={openModal}
              disabled={user.user?.profiles && user.user?.profiles.length >= 5}
              className={`rounded-full border-2 flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out w-14 h-14 ${
                user.user?.profiles && user.user?.profiles.length >= 5
                  ? "opacity-10 cursor-not-allowed"
                  : ""
              }`}
            >
              <FaPlus size={24} className="text-gray-500" />
            </button>
          </div>
          <button
            className="px-5 py-2 mt-6 text-lg bg-secondary text-black font-semibold text-sm rounded-md my-auto opacity-90 hover:opacity-100"
            onClick={() => navigate("/editProfile")}
          >
            Edit
          </button>
        </div>
        <div className="flex justify-between mt-10">
          <p className="font-medium capitalize">my plans</p>
          <button className="bg-black border border-secondary px-4 py-1 rounded-lg" onClick={()=> navigate('/settings/my-plans')} >Check</button>
        </div>
      </div>

      {/* Logout button */}
      <div className="mt-6 flex justify-end absolute bottom-10 right-10">
        <button
          onClick={handleLogout}
          className=" text-red-900 font-semibold rounded-md flex items-center gap-2 opacity-90 hover:opacity-100"
        >
          <FaSignOutAlt size={30} />
        </button>
      </div>
      {isModalOpen && <NewProfile closeModal={closeModal} />}
    </div>
  );
};

export default Settings;
