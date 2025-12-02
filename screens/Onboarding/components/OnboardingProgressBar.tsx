import React from 'react';

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({ currentStep, totalSteps, label }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
        Passo {currentStep} de {totalSteps} {label ? `- ${label}` : ''}
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OnboardingProgressBar;