import React from 'react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children, className }) => {
  return (
    <div className={`max-w-3xl mx-auto w-full bg-emerald-50 dark:bg-gray-800 shadow-lg rounded-2xl p-6 md:p-10 transition-colors duration-300 ${className || ''}`}>
      {children}
    </div>
  );
};

export default OnboardingLayout;