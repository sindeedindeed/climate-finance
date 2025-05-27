import React from 'react';

const Button = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  ...props 
}) => {
  const baseStyles = `
    inline-flex items-center justify-center 
    rounded-xl font-medium 
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    active:scale-95 transform
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    relative overflow-hidden
    select-none
  `;
  
  const variantStyles = {    primary: `
      bg-gradient-to-r from-primary-600 to-primary-700
      hover:from-primary-700 hover:to-primary-800
      text-white shadow-medium hover:shadow-large
      focus:ring-primary-200
      before:absolute before:inset-0 before:bg-white before:opacity-0 
      hover:before:opacity-10 before:transition-opacity before:duration-300
    `,
    export: `
      bg-gradient-to-r from-purple-600 to-purple-700
      hover:from-purple-700 hover:to-purple-800
      text-white shadow-medium hover:shadow-large hover:shadow-purple-200/50
      focus:ring-purple-200
      transition-all duration-200
      hover:scale-105 active:scale-95
    `,
    secondary: `
      bg-white border-2 border-gray-200
      hover:border-primary-300 hover:bg-primary-50
      text-gray-700 hover:text-primary-700
      shadow-soft hover:shadow-medium
      focus:ring-primary-200
    `,
    outline: `
      border-2 border-primary-500 bg-transparent
      hover:bg-primary-500 hover:border-primary-600
      text-primary-600 hover:text-white
      focus:ring-primary-200
      shadow-none hover:shadow-medium
    `,
    ghost: `
      bg-transparent border-none
      hover:bg-primary-50 hover:text-primary-700
      text-gray-600 
      focus:ring-primary-200
      shadow-none
    `,
    danger: `
      bg-gradient-to-r from-error-500 to-error-600
      hover:from-error-600 hover:to-error-700
      text-white shadow-medium hover:shadow-large
      focus:ring-error-200
    `,
    success: `
      bg-gradient-to-r from-success-500 to-success-600
      hover:from-success-600 hover:to-success-700
      text-white shadow-medium hover:shadow-large
      focus:ring-success-200
    `,
  };
  
  const sizeStyles = {
    xs: 'py-1.5 px-3 text-xs gap-1',
    sm: 'py-2 px-4 text-sm gap-2',
    md: 'py-2.5 px-6 text-base gap-2',
    lg: 'py-3 px-8 text-lg gap-3',
    xl: 'py-4 px-10 text-xl gap-3',
  };

  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
  
  return (
    <button 
      className={`
        ${baseStyles} 
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span className="flex-1">{children}</span>
      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;