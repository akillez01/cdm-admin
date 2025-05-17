import { Bell, Menu, Search } from 'lucide-react';
import React, { useState } from 'react';
import ThemeToggle from '../ui/ThemeToggle';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className={`
      bg-white dark:bg-gray-800 shadow-sm fixed z-40
      w-full left-0 transition-all duration-300 ease-in-out
      ${sidebarOpen ? 'md:pl-64' : 'md:pl-20'}
    `}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Lado esquerdo (menu e busca) */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
          >
            <Menu size={24} />
          </button>
          
          <form onSubmit={handleSearchSubmit} className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar..."
                className="form-input pl-10 pr-4 py-2 w-64 rounded-md bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>
        </div>
        
        {/* Lado direito (notificações, tema e perfil) */}
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative"
            aria-label="Notificações"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <ThemeToggle />
          
          <div className="flex items-center ml-3">
            <button 
              className="flex items-center space-x-2 focus:outline-none"
              aria-label="Perfil do usuário"
            >
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="User avatar"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                Admin User
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;