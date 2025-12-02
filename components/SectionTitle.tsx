import React from 'react';

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
      {title}
    </h3>
  );
};

export default SectionTitle;