import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(savedTheme ? savedTheme === 'dark' : prefersDark);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', darkMode);
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      aria-label={darkMode ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;