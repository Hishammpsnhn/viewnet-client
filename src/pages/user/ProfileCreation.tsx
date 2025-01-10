import React, { useState } from "react";
import bgImg from "../../assets/bg/IN-en-20240506-popsignuptwoweeks-perspective_alpha_website_large.webp";
import profilePic1 from "../../assets/profilepic/067-squid-game-pictures-3pds48yf8itgimau.webp";
import profilePic2 from "../../assets/profilepic/1679995562-StrangerThings_Prod_1920x1080.webp";
import profilePic3 from "../../assets/profilepic/cartoon-style-boy-with-silver-short-hair.webp";
import profilePic4 from "../../assets/profilepic/who-is-arguably-the-most-famous-cartoon-character-of-all-v0-ee2zokrs2rzb1.webp";
import profilePic5 from "../../assets/profilepic/5ba098f6c84bf867ab88939a9a605139.webp";

const ProfileCreation = () => {
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

  return (
    <div className="relative h-screen flex items-center justify-center">
    
      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>

      {/* Main Content */}
      <div className="relative bg-opacity-90 p-6 rounded-lg shadow-lg">
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

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 text-md border border-secondary bg-black rounded-md w-full mb-3"
          />
          <input
            type="text"
            placeholder="Enter your Phone number"
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
          <div className="flex gap-2">
            {/* Day */}
            <select
              id="day"
              className="w-1/3 px-3 py-2 p-3 text-md border border-secondary bg-black mb-3 rounded-md"
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {/* Month */}
            <select
              id="month"
              className="w-1/3 px-3 py-2 p-3 text-md border border-secondary bg-black rounded-md mb-3"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            {/* Year */}
            <select
              id="year"
              className="w-1/3 px-3 py-2 p-3 text-md border border-secondary bg-black rounded-md mb-3"
            >
              <option value="">Year</option>
              {Array.from({ length: 50 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="px-3 py-2 mt-6 text-lg bg-secondary w-full text-white rounded-md opacity-90 hover:opacity-100">
          Create Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCreation;
