import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import PageLayout from '../../components/layouts/PageLayout';
import AdminPageHeader from '../../components/layouts/AdminPageHeader';
import DataTable from '../../components/ui/DataTable';
import ErrorState from '../../components/ui/ErrorState';
import Loading from '../../components/ui/Loading';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { getStatusConfig } from '../../utils/statusConfig';
import SearchFilter from '../../components/ui/SearchFilter';

// ...existing code...

<SearchFilter
  data={data}
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder={`Search ${entityType.toLowerCase()}...`}
  entityType={entityType}
  activeFilters={filters}
  onFiltersChange={setFilters}
  onFilteredData={(filtered) => setFilteredData(filtered)}
  showAdvancedSearch={true}
  onClearAll={() => {
    setSearchTerm('');
    setFilters({});
  }}
  className="mb-6"
/>

// ...existing code...
