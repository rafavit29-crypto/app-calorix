import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  type?: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  unit?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  unit,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200 pr-10 placeholder:text-gray-400 dark:placeholder:text-gray-300 text-gray-800 dark:text-white"
          {...props}
        />
        {unit && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 sm:text-sm">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;