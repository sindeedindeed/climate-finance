import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Search, Plus } from 'lucide-react';

const AdminControlsCard = ({
  title,
  count,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  addButtonText,
  onAddClick,
  filters = [],
  children
}) => {
  return (
    <Card hover className="mb-6" padding={true}>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {title} ({count})
          </h3>
          
          {addButtonText && onAddClick && (
            <Button 
              onClick={onAddClick} 
              variant="primary"
              leftIcon={<Plus size={16} />}
              className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 mt-4 md:mt-0"
            >
              {addButtonText}
            </Button>
          )}
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          {filters.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              {filters.map((filter, index) => (
                <select
                  key={index}
                  className="border border-gray-300 rounded-xl text-sm py-2.5 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
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
        
        {/* Additional custom content */}
        {children}
      </div>
    </Card>
  );
};

export default AdminControlsCard;