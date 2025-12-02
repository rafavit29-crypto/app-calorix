import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className,
  ...props
}) => {
  const baseStyles = 'px-6 py-3 rounded-full font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-primary text-white hover:bg-indigo-700 focus:ring-indigo-500';
      break;
    case 'secondary':
      variantStyles = 'bg-transparent border border-primary text-primary hover:bg-indigo-50 dark:hover:bg-gray-600 focus:ring-primary';
      break;
    case 'danger':
      variantStyles = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
    default:
      variantStyles = 'bg-primary text-white hover:bg-indigo-700 focus:ring-indigo-500';
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;