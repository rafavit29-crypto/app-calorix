import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  type?: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  unit?: string;
}

const FormInput: React.FC<FormInputProps> = ({
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
    <div className="mb-6">
      <label htmlFor={id} className="block text-gray-700 text-lg font-semibold mb-2">
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
          className="block w-full px-4 py-2 bg-blue-100 border border-blue-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 pr-10 placeholder:text-blue-400 text-gray-800"
          {...props}
        />
        {unit && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 sm:text-sm">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormInput;