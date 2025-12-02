
import React from 'react';
import { UserProfile } from '../types/user';

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
  userProfile?: UserProfile | null;
  onOpenProfile?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, toggleSidebar, userProfile, onOpenProfile }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300 focus:outline-none mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="text-gray-600 dark:text-gray-300 focus:outline-none p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>

        {userProfile && (
          <button 
            onClick={onOpenProfile}
            className="flex items-center focus:outline-none"
            title="Editar Perfil"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-sm">
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-primary dark:text-indigo-300 font-bold">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
