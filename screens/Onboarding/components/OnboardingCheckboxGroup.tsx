import React from 'react';

interface OnboardingCheckboxGroupProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  otherTextValue?: string;
  onOtherTextChange?: (value: string) => void;
  noneOption?: string; // e.g., 'Nenhuma'
}

const OnboardingCheckboxGroup: React.FC<OnboardingCheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  otherTextValue = '',
  onOtherTextChange,
  noneOption,
}) => {
  const handleCheckboxChange = (option: string) => {
    if (option === noneOption) {
      // If 'Nenhuma' is selected, clear all others
      onChange(selectedValues.includes(noneOption) ? [] : [noneOption]);
      if (onOtherTextChange) {
        onOtherTextChange(''); // Clear other text if 'Nenhuma' is selected
      }
    } else {
      let newValues: string[];
      if (selectedValues.includes(option)) {
        newValues = selectedValues.filter((val) => val !== option);
      } else {
        newValues = [...selectedValues.filter((val) => val !== noneOption), option];
      }
      onChange(newValues);
    }
  };

  const hasOtherOption = options.includes('Outro');
  const showOtherInput = hasOtherOption && selectedValues.includes('Outro');

  return (
    <div className="mb-6">
      <label className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-3">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="checkbox"
              id={`${label}-${option}`}
              name={label}
              value={option}
              checked={selectedValues.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              className="form-checkbox h-5 w-5 text-primary border-gray-300 dark:border-gray-500 rounded focus:ring-primary transition-colors duration-200"
            />
            <label htmlFor={`${label}-${option}`} className="ml-3 text-gray-700 dark:text-gray-200">
              {option}
            </label>
          </div>
        ))}
      </div>
      {showOtherInput && onOtherTextChange && (
        <input
          type="text"
          value={otherTextValue}
          onChange={(e) => onOtherTextChange(e.target.value)}
          placeholder="Especifique outro..."
          className="mt-3 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200 text-gray-800 dark:text-white"
        />
      )}
    </div>
  );
};

export default OnboardingCheckboxGroup;