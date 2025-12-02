import React from 'react';

interface OnboardingSectionTitleProps {
  title: string;
}

const OnboardingSectionTitle: React.FC<OnboardingSectionTitleProps> = ({ title }) => {
  return (
    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
      {title}
    </h3>
  );
};

export default OnboardingSectionTitle;