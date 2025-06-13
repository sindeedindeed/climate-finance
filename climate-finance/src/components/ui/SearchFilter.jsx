import React from 'react';
import { Search } from 'lucide-react';

const SearchFilter = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
      </div>
      
      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {filters.map((filter, index) => (
            <select
              key={index}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[120px]"
            >
              {filter.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;