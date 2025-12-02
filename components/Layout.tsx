import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={`max-w-3xl mx-auto w-full bg-white dark:bg-gray-700 shadow-lg rounded-2xl p-6 md:p-10 transition-colors duration-300 ${className || ''}`}>
      {children}
    </div>
  );
};

export default Layout;