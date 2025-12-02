import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  title: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, title }) => {
  return (
    <div className="fade-in">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default SectionWrapper;