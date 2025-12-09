import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-backend-primary text-backend-text' : 'bg-frontend-primary text-frontend-text'}`}>
      <nav className={`fixed top-0 w-full p-4 flex justify-between items-center z-50 bg-opacity-90 backdrop-blur-sm border-b transition-colors duration-500 ${theme === 'dark' ? 'bg-backend-primary/80 border-white/5' : 'bg-frontend-primary/80 border-black/5'}`}>
        <div className={`font-bold text-xl font-mono transition-colors ${theme === 'dark' ? 'text-backend-accent' : 'text-frontend-accent'}`}>
            {theme === 'dark' ? '<Backend />' : '<Frontend />'}
        </div>
        <button 
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-full border font-medium text-sm transition-all hover:scale-105 active:scale-95 ${
                theme === 'dark' 
                ? 'border-backend-accent text-backend-accent hover:bg-backend-accent/10' 
                : 'border-frontend-accent text-frontend-accent hover:bg-frontend-accent/10'
            }`}
        >
            Switch to {theme === 'dark' ? 'Frontend ☀️' : 'Backend 🌑'}
        </button>
      </nav>
      <main className="pt-24 container mx-auto px-4 pb-20">
        {children}
      </main>
    </div>
  );
};

export default Layout;
