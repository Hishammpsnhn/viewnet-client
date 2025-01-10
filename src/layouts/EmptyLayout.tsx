import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const EmptyLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return <main className="bg-black">{children}</main>;
};

export default EmptyLayout;
