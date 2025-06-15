import React from 'react';
import { Plus, Download, Filter, MoreVertical } from 'lucide-react';
import Button from './Button';
import Card from './Card';

const AdminControlsCard = ({
  title,
  subtitle,
  totalCount = 0,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  onAddNew,
  addNewText = 'Add New',
  onExport,
  showExport = true,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  additionalActions = [],
  children
}) => {
  const hasActiveFilters = Object.values(activeFilters).some(value => 
    value && value !== 'All' && value !== ''
  );

  return (
    <Card className="mb-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {title} {totalCount > 0 && `(${totalCount})`}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {/* Export Button */}
          {showExport && onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              leftIcon={<Download size={16} />}
            >
              Export
            </Button>
          )}

          {/* Additional Actions */}
          {additionalActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              size={action.size || 'sm'}
              onClick={action.onClick}
              leftIcon={action.icon}
              className={action.className}
            >
              {action.label}
            </Button>
          ))}

          {/* Add New Button */}
          {onAddNew && (
            <Button
              variant="primary"
              onClick={onAddNew}
              leftIcon={<Plus size={16} />}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {addNewText}
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        {onSearchChange && (
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       placeholder:text-gray-400"
            />
          </div>
        )}

        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter size={16} />
              <span>Filter by:</span>
            </div>

            {filters.map((filter) => (
              <select
                key={filter.key}
                value={activeFilters[filter.key] || filter.defaultValue || 'All'}
                onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         bg-white min-w-[120px]"
              >
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}

            {/* Clear Filters */}
            {hasActiveFilters && onClearFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-600 hover:text-gray-800"
              >
                Clear All
              </Button>
            )}
          </div>
        )}

        {/* Custom Children Content */}
        {children}
      </div>
    </Card>
  );
};

export default AdminControlsCard;