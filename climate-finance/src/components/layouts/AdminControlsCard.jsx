import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../ui/Button';
import SearchFilter from '../ui/SearchFilter';

const AdminControlsCard = ({
  title,
  subtitle,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  onAddNew,
  addButtonText = 'Add New',
  showAddButton = true,
  children
}) => {
  // Transform filters for SearchFilter component
  const searchFilterProps = filters.map(filter => ({
    value: filter.value,
    onChange: filter.onChange,
    options: filter.options
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>}
            {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
          </div>
          
          {showAddButton && onAddNew && (
            <Button
              onClick={onAddNew}
              leftIcon={<Plus size={16} />}
              className="mt-3 lg:mt-0 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {addButtonText}
            </Button>
          )}
        </div>
        
        {/* Search and filters */}
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          filters={searchFilterProps}
        />
        
        {/* Additional content */}
        {children}
      </div>
    </div>
  );
};

export default AdminControlsCard;