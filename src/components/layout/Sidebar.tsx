import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, DollarSign, BarChart2, 
  Calendar, Package, Settings, LogOut, 
  Church
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Membros', path: '/members', icon: <Users size={20} /> },
    { name: 'Finanças', path: '/finance', icon: <DollarSign size={20} /> },
    { name: 'Estoque', path: '/inventory', icon: <Package size={20} /> },
    { name: 'Eventos', path: '/events', icon: <Calendar size={20} /> },
    { name: 'Relatórios', path: '/reports', icon: <BarChart2 size={20} /> },
    { name: 'Configurações', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-20 h-full bg-primary-500 dark:bg-primary-700 text-white transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-0 md:w-16'
      } overflow-hidden shadow-lg`}
    >
      <div className="flex flex-col h-full">
        <div className={`flex items-center ${isOpen ? 'px-6' : 'px-3'} py-6 justify-center md:justify-start`}>
          <Church size={28} className="text-secondary-500" />
          {isOpen && (
            <span className="ml-2 text-xl font-display font-semibold transition-opacity duration-200">
              IgrejaApp
            </span>
          )}
        </div>
        
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-100 hover:bg-primary-400'
                  } ${!isOpen ? 'justify-center' : ''}`}
                >
                  <span className="text-secondary-400">{item.icon}</span>
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="px-3 py-4 border-t border-primary-400">
          <button className={`flex items-center px-3 py-2 rounded-md text-gray-100 hover:bg-primary-400 w-full ${
            !isOpen ? 'justify-center' : ''
          }`}>
            <LogOut size={20} className="text-secondary-400" />
            {isOpen && <span className="ml-3">Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;