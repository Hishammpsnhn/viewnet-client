import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { profilePics } from "../../utils/mockData";
import {
  editProfile,
  updateUserProfile,
} from "../../reducers/userReducer/userThunks";
import { useNavigate } from "react-router-dom";
import { newSecondProfileCreation } from "../../utils/Validation";
import * as Yup from "yup";
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
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isAdult, setIsAdult] = useState(profileData?.isAdult || false);
  const [username, setUsername] = useState(profileData?.username || "");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(
    profileData?.profilePic || null
  );
  const [availableProfile, setAvailableProfile] = useState<string[] | []>([]);
  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const handleCheckboxChange = () => {
    setIsAdult(!isAdult);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await newSecondProfileCreation.validate(
        {
          profile: selectedProfile,
          username,
        },
        { abortEarly: false }
      );
      if (user.user && selectedProfile) {
        if (profileData) {
          dispatch(
            editProfile({
              userId: user.user?._id,
              profileData: {
                id: profileData._id,
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
          navigate("/");
        }
      }
      closeModal();
    } catch (error) {
      console.error(error);
      if (error instanceof Yup.ValidationError) {
        console.log("Yup validation error:", error);
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) errors[err.path] = err.message;
        });
        console.log(errors);
        setValidationErrors(errors);
      }
    }
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
          {validationErrors.profile && (
            <p className="text-sm text-red-700 mb-2 w-full">
              {validationErrors.profile}
            </p>
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
          {validationErrors.username && (
            <p className="text-sm text-red-700 mb-2 w-full">
              {validationErrors.username}
            </p>
          )}
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
