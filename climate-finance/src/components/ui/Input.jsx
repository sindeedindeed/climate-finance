import React from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  options = [],
  rows = 4,
  step,
  min,
  max,
  containerClassName = '',
  className = '',
  leftIcon,
  rightIcon,
  showPasswordToggle = true, // Add this prop and set default
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const baseInputClasses = `
    w-full px-4 py-3 border rounded-lg transition-all duration-200
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
    }
    ${disabled 
      ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
      : 'bg-white hover:border-gray-400'
    }
    focus:ring-2 focus:ring-opacity-20 focus:outline-none
    ${leftIcon ? 'pl-11' : ''}
    ${rightIcon || type === 'password' ? 'pr-11' : ''}
    ${className}
  `;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={baseInputClasses}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'password':
        return (
          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                {leftIcon}
              </div>
            )}
            <input
              id={name}
              name={name}
              type={showPassword ? 'text' : 'password'}
              value={value || ''}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              className={`${baseInputClasses} ${leftIcon ? 'pl-11' : ''} ${showPasswordToggle ? 'pr-11' : ''}`}
              {...props}
            />
            {showPasswordToggle && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        );

      case 'number':
        return (
          <input
            id={name}
            name={name}
            type="number"
            value={value || ''}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            step={step}
            min={min}
            max={max}
            className={baseInputClasses}
            {...props}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              id={name}
              name={name}
              type="checkbox"
              checked={value || false}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              required={required}
              disabled={disabled}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              {...props}
            />
            <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
              {label}
            </label>
          </div>
        );

      default:
        return (
          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {leftIcon}
              </div>
            )}
            <input
              id={name}
              name={name}
              type={type}
              value={value || ''}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              step={step}
              min={min}
              max={max}
              className={baseInputClasses}
              {...props}
            />
            {rightIcon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {error && (
        <div className="flex items-center space-x-1 text-red-600 text-sm">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default Input;