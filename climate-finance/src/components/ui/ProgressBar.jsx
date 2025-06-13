import React from 'react';

const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  showValue = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  color = 'primary', // 'primary' | 'success' | 'warning' | 'error'
  animated = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    primary: 'bg-purple-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label and value display */}
      {(label || showPercentage || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          <div className="text-sm text-gray-600">
            {showValue && (
              <span className="mr-2">
                {typeof value === 'number' ? value.toLocaleString() : value} / {typeof max === 'number' ? max.toLocaleString() : max}
              </span>
            )}
            {showPercentage && (
              <span>{Math.round(percentage)}%</span>
            )}
          </div>
        </div>
      )}
      
      {/* Progress bar */}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`
            ${colorClasses[color]} ${sizeClasses[size]} rounded-full 
            transition-all duration-500 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;