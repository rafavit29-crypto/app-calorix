import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  return (
    <div className="mb-4">
      {label && <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{label}</p>}
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;