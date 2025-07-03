import { User } from '@supabase/supabase-js';
import { ChevronDown, LogOut, Menu, Search, Settings, User as UserIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSupabase } from '../../hooks/useSupabase';
import AdminProfileModal from '../ui/AdminProfileModal';
import NotificationPanel from '../ui/NotificationPanel';
import ThemeToggle from '../ui/ThemeToggle';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { supabase } = useSupabase();
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(res => {
      if (res.data?.user) setUser(res.data.user);
    });
  }, [supabase]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

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
          <NotificationPanel />
          
          <ThemeToggle />
          
          <div className="flex items-center ml-3 relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
              aria-label="Menu do usuário"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={user?.user_metadata?.avatar_url || 'https://randomuser.me/api/portraits/men/1.jpg'}
                alt="User avatar"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                {authUser?.name || user?.user_metadata?.name || 'Admin User'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {authUser?.name || user?.user_metadata?.name || 'Admin User'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {authUser?.email || user?.email}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                >
                  <UserIcon className="h-4 w-4" />
                  Editar Perfil
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Adicionar funcionalidade de configurações se necessário
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                >
                  <Settings className="h-4 w-4" />
                  Configurações
                </button>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            )}

            <AdminProfileModal
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
              user={user}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;