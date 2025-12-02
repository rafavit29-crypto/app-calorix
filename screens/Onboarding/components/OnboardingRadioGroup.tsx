import React from 'react';

interface OnboardingRadioGroupProps {
  label: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string; // Unique name for the radio group
}

const OnboardingRadioGroup: React.FC<OnboardingRadioGroupProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  name,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-3">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option}`}
              name={name}
              value={option}
              checked={selectedValue === option}
              onChange={(e) => onChange(e.target.value)}
              className="form-radio h-5 w-5 text-primary border-gray-300 dark:border-gray-500 focus:ring-primary transition-colors duration-200"
            />
            <label htmlFor={`${name}-${option}`} className="ml-3 text-gray-700 dark:text-gray-200">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingRadioGroup;