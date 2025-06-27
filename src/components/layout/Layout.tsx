import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMinimize = () => {
    setSidebarMinimized(!sidebarMinimized);
    // Garante que o sidebar esteja aberto quando for minimizado
    if (!sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isOpen={sidebarOpen}
        isMinimized={sidebarMinimized}
        onToggle={toggleSidebar}
        onMinimize={toggleMinimize}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? (sidebarMinimized ? 'md:ml-20' : 'md:ml-64') : 'md:ml-0'
      }`}>
        <Header 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto pt-16 pb-6 px-4 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;