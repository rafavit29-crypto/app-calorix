import React from 'react';

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  otherTextValue?: string;
  onOtherTextChange?: (value: string) => void;
  noneOption?: string; // e.g., 'Nenhuma'
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
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
      <label className="block text-gray-700 text-lg font-semibold mb-3">{label}</label>
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
              className="form-checkbox h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor={`${label}-${option}`} className="ml-3 text-gray-700">
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
          className="mt-3 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
        />
      )}
    </div>
  );
};

export default CheckboxGroup;