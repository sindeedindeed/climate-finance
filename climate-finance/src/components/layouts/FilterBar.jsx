import React from 'react';
import Button from '../ui/Button';
import { Search, Filter } from 'lucide-react';

const FilterBar = ({
  searchTerm = '',
  onSearchChange = () => {},
  searchPlaceholder = 'Search...',
  filters = [],
  resultCount = 0,
  totalCount = 0
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      {/* Search Input */}
      <div className="flex-1 flex items-center relative">
        <Search size={16} className="absolute left-3 text-gray-400" />
        <input
          type="text"
          className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {filters.map((filter, idx) => (
          <div key={filter.label} className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="pl-9 pr-6 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              value={filter.value}
              onChange={e => filter.onChange(e.target.value)}
            >
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {/* Results Count */}
      <div className="text-sm text-gray-500 ml-2 min-w-fit">
        Showing {resultCount} of {totalCount} projects
      </div>
    </div>
  );
};

export default FilterBar;
