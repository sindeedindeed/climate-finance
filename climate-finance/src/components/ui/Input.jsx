import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  showPasswordToggle = false,
  options = [], // for select type
  rows = 3, // for textarea
  step,
  min,
  max,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const baseClasses = `
    w-full px-3 py-2 border rounded-xl shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
    transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed
  `;
  
  const borderClasses = error 
    ? 'border-red-300 focus:ring-red-500' 
    : 'border-gray-300';
    
  const inputClasses = `${baseClasses} ${borderClasses} ${className}`;
  
  const renderInput = () => {
    const commonProps = {
      ref,
      name,
      value,
      onChange,
      onBlur,
      placeholder,
      required,
      disabled,
      className: inputClasses,
      ...props
    };

    switch (type) {
      case 'textarea':
        return <textarea {...commonProps} rows={rows} />;
        
      case 'select':
        return (
          <select {...commonProps}>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'number':
        return <input {...commonProps} type="number" step={step} min={min} max={max} />;
        
      case 'password':
        return (
          <input 
            {...commonProps} 
            type={showPasswordToggle && showPassword ? 'text' : 'password'} 
          />
        );
        
      default:
        return <input {...commonProps} type={type} />;
    }
  };

  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <div className={leftIcon ? 'pl-10' : ''}>
          {renderInput()}
        </div>
        
        {(rightIcon || (type === 'password' && showPasswordToggle)) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === 'password' && showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            ) : rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;