import React from 'react';

interface OnboardingSectionWrapperProps {
  children: React.ReactNode;
  title: string;
}

const OnboardingSectionWrapper: React.FC<OnboardingSectionWrapperProps> = ({ children, title }) => {
  return (
    <div className="fade-in"> {/* Consider defining 'fade-in' in global CSS or Tailwind config if not already */}
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default OnboardingSectionWrapper;