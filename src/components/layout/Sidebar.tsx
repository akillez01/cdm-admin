import {
    Activity,
    BarChart2,
    Calendar,
    ChevronLeft,
    DollarSign,
    Home,
    LogOut,
    Menu,
    Package,
    Settings,
    Users,
    X
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  isMinimized: boolean;
  onToggle: () => void;
  onMinimize: () => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  isMinimized, 
  onToggle, 
  onMinimize, 
  onClose 
}) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [logoError, setLogoError] = useState(false);
  const [logoPath, setLogoPath] = useState("/cdm-admin/images/cdmlogo.png");
  
  // Caminhos alternativos para tentar
  const logoPaths = [
    "/cdm-admin/images/cdmlogo.png",
    "./images/cdmlogo.png", 
    "images/cdmlogo.png",
    "/images/cdmlogo.png"
  ];
  
  const tryNextLogoPath = () => {
    const currentIndex = logoPaths.indexOf(logoPath);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < logoPaths.length) {
      setLogoPath(logoPaths[nextIndex]);
      console.log(`Tentando logo path: ${logoPaths[nextIndex]}`);
    } else {
      console.warn('Todos os caminhos da logo falharam, usando fallback');
      setLogoError(true);
    }
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={22} /> },
    { name: 'Membros', path: '/members', icon: <Users size={22} /> },
    { name: 'Finanças', path: '/finance', icon: <DollarSign size={22} /> },
    { name: 'Estoque', path: '/inventory', icon: <Package size={22} /> },
    { name: 'Eventos', path: '/events', icon: <Calendar size={22} /> },
    { name: 'Relatórios', path: '/reports', icon: <BarChart2 size={22} /> },
    { name: 'Tempo Real', path: '/realtime', icon: <Activity size={22} /> },
    { name: 'Configurações', path: '/settings', icon: <Settings size={22} /> },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Botão de abrir (hamburger) - Mobile */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed md:hidden z-30 top-4 left-4 p-2 rounded-md bg-primary-600 text-white shadow-lg"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-primary-600 text-white 
          transition-all duration-300 ease-in-out
          ${isOpen ? (isMinimized ? 'w-20' : 'w-64') : 'w-0'}
          overflow-hidden shadow-xl
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-primary-500">
            <div className="flex items-center">
              {!logoError ? (
                <img 
                  src={logoPath}
                  alt="CDM Logo" 
                  className="w-8 h-8 object-cover rounded-full bg-white" 
                  onError={() => {
                    console.warn(`Falha ao carregar logo CDM em: ${logoPath}`);
                    tryNextLogoPath();
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-primary-300 rounded-full flex items-center justify-center text-primary-800 font-bold text-sm">
                  CDM
                </div>
              )}
              {!isMinimized && (
                <h1 className="ml-3 text-xl font-bold truncate">Céu das Matas</h1>
              )}
            </div>
            
            {/* Botão de minimizar (desktop) */}
            <button
              onClick={onMinimize}
              className="hidden md:flex items-center justify-center p-1 rounded hover:bg-primary-500 transition"
              aria-label={isMinimized ? "Expandir menu" : "Minimizar menu"}
            >
              <ChevronLeft 
                size={20} 
                className={`transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`}
              />
            </button>
            
            {/* Botão de fechar (mobile) */}
            <button
              onClick={onClose}
              className="md:hidden flex items-center justify-center p-1 rounded hover:bg-primary-500 transition"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`flex items-center rounded-lg p-3 transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary-700 text-white'
                        : 'hover:bg-primary-500 text-gray-100'
                    } ${isMinimized ? 'justify-center' : ''}`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isMinimized && (
                      <span className="ml-3 truncate text-sm font-medium">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-primary-500 p-2">
            <button
              onClick={logout}
              className={`flex items-center w-full rounded-lg p-3 text-gray-100 hover:bg-primary-500 ${
                isMinimized ? 'justify-center' : ''
              }`}
            >
              <LogOut size={22} />
              {!isMinimized && <span className="ml-3 truncate text-sm">Sair</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;