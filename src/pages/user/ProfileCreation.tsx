import React, { useState } from "react";
import bgImg from "../../assets/bg/IN-en-20240506-popsignuptwoweeks-perspective_alpha_website_large.webp";
import profilePic1 from "../../assets/profilepic/067-squid-game-pictures-3pds48yf8itgimau.webp";
import profilePic2 from "../../assets/profilepic/1679995562-StrangerThings_Prod_1920x1080.webp";
import profilePic3 from "../../assets/profilepic/cartoon-style-boy-with-silver-short-hair.webp";
import profilePic4 from "../../assets/profilepic/who-is-arguably-the-most-famous-cartoon-character-of-all-v0-ee2zokrs2rzb1.webp";
import profilePic5 from "../../assets/profilepic/5ba098f6c84bf867ab88939a9a605139.webp";
import { useTenantLoginValidator } from "../../hooks/useValidate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store.ts";
import { ProfileCreate_API } from "../../api/user/profileApis.ts";
import { useNavigate, useParams } from "react-router-dom";
import { updateUserProfile } from "../../reducers/authReducers.ts";
const ProfileCreation = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
   
  const profilePics = [
    profilePic1,
    profilePic2,
    profilePic3,
    profilePic4,
    profilePic5,
  ];
  const [selectedPic, setSelectedPic] = useState(
    Math.floor(profilePics.length / 2)
  );

  // Single useState for all form fields
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    dob: "",
  });

  const [isAdult, setIsAdult] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "dob" && value) {
      const dob = new Date(value);
      const age = new Date().getFullYear() - dob.getFullYear();
      setIsAdult(age >= 18);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    const validate = useTenantLoginValidator(formData);
     (validate);
    if (validate) {
      setValidationError(validate);
    } else {
       ("Form Submitted:");
      let data = {
        ...formData,
        isAdult,
        profilePic: profilePics[selectedPic],
      };
      if (data && id) {
        const res = await dispatch(
          updateUserProfile({ userId: id, profileData: data })
        ).unwrap();
         (res);
        if (res.success) {
          navigate("/");
        }
      }
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>

      {/* Main Content */}
      <div className="relative bg-opacity-90 p-6 rounded-lg shadow-lg text-white">
        {/* Profile Heading */}
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Create Your Profile
        </h2>

        <div className="flex flex-col items-center mb-20">
          <div className="flex gap-4 h-[15vh]">
            {profilePics.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`Profile ${index + 1}`}
                onClick={() => setSelectedPic(index)}
                className={`rounded-full border-2 object-cover cursor-pointer transition-all duration-300 ease-in-out ${
                  selectedPic === index
                    ? "w-32 h-32 border-secondary"
                    : "w-24 h-24 border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <form noValidate onSubmit={handleSubmit}>
          <div className="mb-4">
            {validationError && (
              <label
                htmlFor="username"
                className="block text-sm font-medium text-red-800 mb-5"
              >
                {validationError}
              </label>
            )}

            <input
              type="text"
              name="username"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange}
              className="p-3 text-md border border-secondary bg-black rounded-md w-full mb-3"
            />
            <input
              type="number"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 text-md border border-secondary bg-black rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="p-3 text-md border border-secondary bg-black rounded-md w-full mb-3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adult Status
            </label>
            <p className="text-sm text-gray-500">
              {isAdult ? "You are an adult." : "You are not an adult."}
            </p>
          </div>

          <button
            type="submit"
            className="px-3 py-2 mt-6 text-lg bg-secondary w-full text-white rounded-md opacity-90 hover:opacity-100"
            disabled={!isAdult}
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
