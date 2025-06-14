import React from 'react';

const ProgressBar = ({ 
  label = "Progress",
  percentage = 0, 
  current = 0, 
  total = 0, 
  formatValue = (value) => value,
  color = "purple",
  showValues = true,
  className = ""
}) => {
  const colorClasses = {
    purple: {
      gradient: "from-purple-500 to-purple-600",
      text: "text-purple-600",
      bg: "from-gray-50 to-purple-50"
    },
    green: {
      gradient: "from-green-500 to-green-600", 
      text: "text-green-600",
      bg: "from-gray-50 to-green-50"
    },
    blue: {
      gradient: "from-blue-500 to-blue-600",
      text: "text-blue-600", 
      bg: "from-gray-50 to-blue-50"
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      text: "text-orange-600",
      bg: "from-gray-50 to-orange-50"
    }
  };

  const selectedColor = colorClasses[color] || colorClasses.purple;

  return (
    <div className={`bg-gradient-to-r ${selectedColor.bg} rounded-lg p-6 border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-700 font-semibold">
          {label}
        </div>
        <div className={`text-sm ${selectedColor.text} font-bold`}>
          {percentage.toFixed(1)}%
        </div>
      </div>
      
      {showValues && (
        <div className="text-sm text-gray-500 mb-4">
          {formatValue(current)} of {formatValue(total)}
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
        <div
          className={`bg-gradient-to-r ${selectedColor.gradient} h-4 rounded-full transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;