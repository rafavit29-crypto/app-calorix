import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Toast } from '../types';

interface NotificationToastProps extends Toast {
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, type, onClose }) => {
  let bgColor = '';
  let borderColor = '';
  let textColor = '';

  switch (type) {
    case 'success':
      bgColor = 'bg-green-100 dark:bg-green-800';
      borderColor = 'border-green-500 dark:border-green-600';
      textColor = 'text-green-800 dark:text-green-100';
      break;
    case 'error':
      bgColor = 'bg-red-100 dark:bg-red-800';
      borderColor = 'border-red-500 dark:border-red-600';
      textColor = 'text-red-800 dark:text-red-100';
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-100 dark:bg-blue-800';
      borderColor = 'border-blue-500 dark:border-blue-600';
      textColor = 'text-blue-800 dark:text-blue-100';
      break;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${bgColor} border-l-4 ${borderColor} transition-all duration-300 transform animate-slide-in`}
      role="alert"
    >
      {type === 'success' && (
        <svg className="w-6 h-6 text-green-700 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )}
      {type === 'error' && (
        <svg className="w-6 h-6 text-red-700 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )}
      {type === 'info' && (
        <svg className="w-6 h-6 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )}
      <span className={`font-medium ${textColor}`}>{message}</span>
      <button onClick={onClose} className="ml-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>,
    document.body
  );
};

export default NotificationToast;