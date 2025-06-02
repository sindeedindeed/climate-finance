import React from 'react';

const CheckboxGroup = ({ 
  label, 
  options = [], 
  selectedValues = [], 
  onChange, 
  className = '',
  getOptionId = (option) => option.id,
  getOptionLabel = (option) => option.name,
  getOptionSubtext = () => null
}) => {
  const handleCheckboxChange = (optionId, isChecked) => {
    let newSelectedValues;
    if (isChecked) {
      newSelectedValues = [...selectedValues, optionId];
    } else {
      newSelectedValues = selectedValues.filter(id => id !== optionId);
    }
    onChange(newSelectedValues);
  };

  return (
    <div className={`bg-white border border-gray-300 rounded-xl p-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      )}
      
      {options.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {options.map(option => {
            const optionId = getOptionId(option);
            const isSelected = selectedValues.includes(optionId);
            const subtext = getOptionSubtext(option);
            
            return (
              <label 
                key={optionId} 
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer group ${
                  isSelected 
                    ? 'bg-purple-50 border-purple-200 shadow-sm' 
                    : 'bg-gray-50 border-gray-300 hover:bg-purple-25 hover:border-purple-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleCheckboxChange(optionId, e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-400 rounded transition-colors duration-200"
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium block transition-colors duration-200 ${
                    isSelected ? 'text-purple-800' : 'text-gray-900 group-hover:text-purple-700'
                  }`}>
                    {getOptionLabel(option)}
                  </span>
                  {subtext && (
                    <span className={`text-xs block mt-1 transition-colors duration-200 ${
                      isSelected ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-500'
                    }`}>
                      {subtext}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">No options available</p>
        </div>
      )}
      
      {/* Selection counter */}
      {options.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-300">
          <p className="text-xs text-gray-500">
            {selectedValues.length} of {options.length} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckboxGroup;