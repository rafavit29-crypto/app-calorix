import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4 ${className || ''} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;