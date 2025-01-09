import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar is fixed on the left, only on larger screens */}
        <div className=" fixed top-0 left-0 h-full ">
          <Sidebar />
        </div>
        <main className="flex-grow ml-20 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
