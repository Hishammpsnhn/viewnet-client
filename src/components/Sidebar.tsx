import { FaSearch, FaCog, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaHistory } from "react-icons/fa";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const SidebarItem = ({ icon, label, onClick }: SidebarItemProps) => (
  <div
    className="relative group flex items-center cursor-pointer"
    onClick={onClick}
  >
    <div className="text-white text-2xl opacity-85 hover:opacity-100 hover:ml-1">
      {icon}
    </div>
    <div className="absolute left-full hidden group-hover:block text-white bg-primary px-10 py-2 rounded-r-md transform translate-x-8 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 animate-fade-right animate-once animate-ease-in-out animate-normal">
      {label}
    </div>
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: <FaHome />, label: "Home", onClick: () => navigate("/") },
    { icon: <FaSearch />, label: "Search", onClick: () => navigate("/search") },
    {
      icon: <FaHistory />,
      label: "History",
      onClick: () => navigate("/history"),
    },
    {
      icon: <FaCog />,
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
  ];

  return (
    <div className="flex relative">
      <div className="w-16 h-screen bg-transparent flex flex-col justify-between items-center">
        <div className="mt-4 mb-12">
          <h1 className="text-xl font-bold cursor-pointer text-center tracking-tight leading-5">
            VIEW
            <br />
            <span className="text-sm text-center">NET</span>
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow space-y-12">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
