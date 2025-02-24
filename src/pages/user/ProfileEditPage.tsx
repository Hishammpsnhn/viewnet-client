import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import NewProfile from "../../features/user/NewProfile";

interface Profile {
  _id: string;
  profilePic: string;
  username: string;
  isAdult: boolean;
}

const ProfileEditPage = () => {
  const { user, selectedProfile } = useSelector((state: RootState) =>  state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  const handleOpenModal = (profile: Profile) => {
    setCurrentProfile(profile);
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
    setCurrentProfile(null);
  };

  return (
    <>
      <div className="flex justify-center items-center ">
        <div className="flex gap-6">
          {user?.profiles?.map((item: Profile, index) => (
            <div
              key={item._id || index}
              className="relative group w-24 h-24 cursor-pointer"
              onClick={() => handleOpenModal(item)} 
            >
              <img
                src={item.profilePic}
                alt={`Profile ${item.username}`}
                className={`rounded-full border-2 object-cover w-full h-full ${
                  selectedProfile === item._id
                    ? "border-blue-500"
                    : "border-black"
                }`}
              />
              <button
                className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <NewProfile
          closeModal={handleCloseModal}
          profileData={currentProfile}
        />
      )}
    </>
  );
};

export default ProfileEditPage;
