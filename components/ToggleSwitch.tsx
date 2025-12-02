import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, handleToggle }) => {
  return (
    <label
      htmlFor="toggle-switch"
      className="flex items-center cursor-pointer"
    >
      <div className="relative">
        <input
          type="checkbox"
          id="toggle-switch"
          className="sr-only"
          checked={isOn}
          onChange={handleToggle}
        />
        <div className={`block ${isOn ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'} w-14 h-8 rounded-full transition-colors duration-200`}></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ${
            isOn ? 'translate-x-6' : 'translate-x-0'
          }`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;