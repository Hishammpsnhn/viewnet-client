import { useState } from "react";
import profilePic1 from "../../assets/profilepic/067-squid-game-pictures-3pds48yf8itgimau.webp";
import profilePic2 from "../../assets/profilepic/1679995562-StrangerThings_Prod_1920x1080.webp";
import profilePic3 from "../../assets/profilepic/cartoon-style-boy-with-silver-short-hair.webp";
import profilePic4 from "../../assets/profilepic/who-is-arguably-the-most-famous-cartoon-character-of-all-v0-ee2zokrs2rzb1.webp";
import profilePic5 from "../../assets/profilepic/5ba098f6c84bf867ab88939a9a605139.webp";
import { FaPlus } from "react-icons/fa"; // Import the plus icon from React Icons

const Settings = () => {
  const profilePics = [
    profilePic1,
    profilePic2,
    profilePic3,
    profilePic4,
    profilePic5,
  ];

  const [selectedPic, setSelectedPic] = useState(Math.floor(profilePics.length / 2));

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold mb-5">Settings</h2>
        <div className="flex justify-between mb-5">
          <h2>
            Subscribe to enjoy View<br />Net
          </h2>
          <button  className="px-3 py-2 mt-6 text-lg bg-secondary text-black font-semibold text-sm rounded-md opacity-90 hover:opacity-100">Subscribe</button>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-4 items-center">
            {profilePics.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`Profile ${index + 1}`}
                onClick={() => setSelectedPic(index)}
                className={`rounded-full border-2 object-cover cursor-pointer ${
                  selectedPic === index
                    ? "w-20 h-20 border-secondary"
                    : "w-16 h-16 border-gray-300"
                }`}
              />
            ))}
            {/* Plus icon for the last empty space */}
            <div
              onClick={() => {}}
              className={`rounded-full border-2 flex justify-center  items-center cursor-pointer transition-all duration-300 ease-in-out w-14 h-14`}
            >
              <FaPlus size={24} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
