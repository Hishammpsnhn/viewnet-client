import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { profilePics } from "../../utils/mockData";
import { editProfile, updateUserProfile } from "../../reducers/userReducer/userThunks";
import { useNavigate } from "react-router-dom";

interface Profile {
  _id: string;
  profilePic: string;
  username: string;
  isAdult: boolean;
}

interface NewProfileProps {
  closeModal: () => void;
  profileData?: Profile | null; 
}

const NewProfile: React.FC<NewProfileProps> = ({ closeModal, profileData }) => {
  console.log(profileData?._id);
  const user = useSelector((state: RootState) =>  state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isAdult, setIsAdult] = useState(profileData?.isAdult || false);
  const [username, setUsername] = useState(profileData?.username || "");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(
    profileData?.profilePic || null
  );
  const [availableProfile, setAvailableProfile] = useState<string[] | []>([]);
  const [validateError, setValidError] = useState<string | null>(null);
  const navigate = useNavigate()

  const handleCheckboxChange = () => {
    setIsAdult(!isAdult);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  console.log(profileData?._id,profileData?.isAdult,profileData?.profilePic,profileData?.username)
  const handleSubmit = async () => {
    setValidError(null);
    if (!selectedProfile) {
      setValidError("Please select a profile. ");
      return;
    }

    if (username.length < 3) {
      setValidError("Please provide a valid name. ");
      return;
    }
    console.log(profileData)
    if (user.user) {
      if (profileData) {
        dispatch(
          editProfile({
            userId: user.user?._id,
            profileData: {
              id:profileData._id ,
              isAdult: isAdult,
              profilePic: selectedProfile,
              username: username,
            },
          })
        );
      } else {
        await dispatch(
          updateUserProfile({
            userId: user.user?._id,
            profileData: {
              isAdult: isAdult,
              profilePic: selectedProfile,
              username: username,
            },
          })
        ).unwrap();
        navigate('/')
      }
    }
    closeModal();
  };

  useEffect(() => {
    const selected = user.user?.profiles;
    if (selected) {
      const availableProfiles = profilePics.filter(
        (profile) =>
          !selected.some(
            (selectedProfile) => selectedProfile.profilePic === profile
          )
      );
      setAvailableProfile(availableProfiles);
    }
  }, [user.user?.profiles]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex justify-center items-center">
      <div className="relative border p-6 rounded-lg w-3/4 md:w-3/6 lg:w-2/6">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-700"
        >
          X
        </button>
        {!profileData ? (
          <h2 className="text-xl font-semibold mb-4">Create Profile</h2>
        ) : (
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        )}

        <div className="flex flex-col items-center">
          {validateError && (
            <p className="text-sm text-red-700 mb-2 w-full">{validateError}</p>
          )}
          <div className="flex gap-4 h-[15vh]">
            {availableProfile.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`Profile ${index + 1}`}
                onClick={() => {
                  setSelectedProfile(item);
                }}
                className={`rounded-full border-2 object-cover cursor-pointer transition-all duration-300 ease-in-out ${
                  selectedProfile === item
                    ? "w-20 h-20 border-secondary"
                    : "w-16 h-16 border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            className="w-full p-2 mt-1 border border-secondary bg-black rounded-md"
          />
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label htmlFor="isAdult" className="text-sm">
              Is this for Kids?
            </label>
            <p className="text-[10px] text-gray-600">
              Content rated U|A 7+ & below
            </p>
          </div>
          <div className="mb-4 my-auto flex items-center">
            <input
              type="checkbox"
              id="isAdult"
              checked={isAdult}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
          </div>
        </div>
        <button
          className="w-full py-2 bg-secondary text-black rounded-md opacity-80 hover:opacity-85"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewProfile;
