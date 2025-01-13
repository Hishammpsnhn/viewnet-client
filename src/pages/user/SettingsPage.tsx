import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { UseDispatch, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import NewProfile from "../../features/auth/NewProfile";
import { updateDefaultProfile } from "../../reducers/authReducers";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [selectedProfile, setSelectedProfile] = useState(
    user.user?.defaultProfile
  );
  console.log(selectedProfile);
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

  useEffect(() => {
    if (!selectedProfile && user.user?.defaultProfile) {
      setSelectedProfile(user.user.defaultProfile);
    }
  }, [user.user?.defaultProfile, selectedProfile]);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold mb-5">Settings</h2>
        <div className="flex justify-between mb-5">
          <h2>
            Subscribe to enjoy View
            <br />
            Net
          </h2>
          <button className="px-3 py-2 mt-6 text-lg bg-secondary text-black font-semibold text-sm rounded-md opacity-90 hover:opacity-100">
            Subscribe
          </button>
        </div>
        <div className="flex flex-col">
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
        </div>
      </div>

      {/* Conditionally render the NewProfile modal */}
      {isModalOpen && <NewProfile closeModal={closeModal} />}
    </div>
  );
};

export default Settings;
