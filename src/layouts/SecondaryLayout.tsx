import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const SecondaryLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-primary text-white">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar is fixed on the left, only on larger screens */}
        <div className=" fixed top-0 left-0 h-full z-10">
          <Sidebar />
        </div>
        <main className="flex-grow overflow-y-auto ml-16 bg-black px-10 py-5">{children}</main>
      </div>
    </div>
  );
};

export default SecondaryLayout;
