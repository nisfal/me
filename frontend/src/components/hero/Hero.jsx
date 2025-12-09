import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Hero = () => {
    const { theme } = useTheme();

    return (
        <div className="flex flex-col items-center text-center py-20 animate-fade-in">
            <div className={`mb-6 text-sm font-mono px-4 py-1 rounded-full border ${theme === 'dark' ? 'border-backend-accent text-backend-accent bg-backend-accent/10' : 'border-frontend-accent text-frontend-accent bg-frontend-accent/10'}`}>
                {theme === 'dark' ? 'System_Status: ONLINE' : 'User Experience: OPTIMIZED'}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                {theme === 'dark' ? (
                    <span>
                        Architecting <span className="text-backend-accent">Scalable</span> Systems
                    </span>
                ) : (
                    <span>
                        Building <span className="text-frontend-accent">Beautiful</span> Interfaces
                    </span>
                )}
            </h1>
            
            <p className="max-w-2xl text-xl opacity-80 mb-10">
                {theme === 'dark' 
                    ? 'Specializing in high-performance Node.js backends and distributed systems.'
                    : 'Creating intuitive, reactive React frontends with a focus on modern design patterns.'
                }
            </p>

            <div className="flex gap-4">
                <button className={`px-8 py-3 rounded-lg font-bold text-white transition-transform hover:-translate-y-1 ${theme === 'dark' ? 'bg-backend-accent hover:opacity-90' : 'bg-frontend-accent hover:opacity-90'}`}>
                    View {theme === 'dark' ? 'Code' : 'Projects'}
                </button>
                <button className={`px-8 py-3 rounded-lg font-bold border transition-transform hover:-translate-y-1 ${theme === 'dark' ? 'border-backend-accent text-backend-accent hover:bg-backend-accent/10' : 'border-frontend-accent text-frontend-accent hover:bg-frontend-accent/10'}`}>
                    Contact Me
                </button>
            </div>
        </div>
    );
};

export default Hero;
