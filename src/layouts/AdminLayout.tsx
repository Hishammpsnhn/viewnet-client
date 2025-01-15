import React from "react";
import AdminSidebar from "../components/AdminSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-full z-10 w-64">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-grow ml-64 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
