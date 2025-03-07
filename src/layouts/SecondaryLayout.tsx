import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  search?:boolean;
  gradient?:boolean;
}

const SecondaryLayout: React.FC<MainLayoutProps> = ({ children ,search,gradient}) => {
  return (
    <div className="flex flex-col min-h-screen bg-primary text-white">
      <Header search={search} gradient={gradient} />
      <div className="flex flex-1">
        {/* Sidebar is fixed on the left, only on larger screens */}
        <div className=" fixed top-0 left-0 h-full z-10">
          <Sidebar />
        </div>
        <main className="flex-grow overflow-y-auto ml-16 bg-primary">{children}</main>
      </div>
    </div>
  );
};

export default SecondaryLayout;
