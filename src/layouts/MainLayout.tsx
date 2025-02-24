import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  gradient?:boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children,gradient }) => {
  return (
    <div className="flex flex-col min-h-screen bg-primary text-white">
      <Header gradient={gradient}  />
      <div className="flex flex-1">
        {/* Sidebar is fixed on the left, only on larger screens */}
        <div className=" fixed top-0 left-0 h-full z-20">
          <Sidebar />
        </div>
        <main className="flex-grow overflow-y-auto scrollbar-hidden z-10">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
