import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'md:ml-64' : 'md:ml-16'
      }`}>
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto pt-16 pb-6 px-4 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;