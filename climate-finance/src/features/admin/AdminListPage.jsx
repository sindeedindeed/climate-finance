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

const AdminListPage = ({
  title,
  subtitle,
  apiService,
  entityName, // 'project', 'agency', etc.
  columns,
  searchPlaceholder = 'Search...',
  filters = [],
  getRowActions = () => [],
  onRowClick = null,
  additionalFilters = null,
  customEmptyState = null,
  onAddNew = null // Add this prop
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(
    filters.reduce((acc, filter) => ({ ...acc, [filter.key]: filter.defaultValue || 'All' }), {})
  );
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getAll();
      
      // Fix: Ensure data is always an array
      const responseData = response.data || response || [];
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || `Failed to fetch ${entityName}s`);
      setData([]); // Fix: Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data - Fix: Add safety check
  const filteredData = Array.isArray(data) ? data.filter(item => {
    // Search filter
    if (searchTerm) {
      const searchFields = columns.map(col => col.searchKey || col.key);
      const matchesSearch = searchFields.some(field => 
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (!matchesSearch) return false;
    }

    // Custom filters
    return filters.every(filter => {
      const filterValue = activeFilters[filter.key];
      if (!filterValue || filterValue === 'All') return true;
      return item[filter.key] === filterValue;
    });
  }) : [];

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setActiveFilters(filters.reduce((acc, filter) => ({ ...acc, [filter.key]: 'All' }), {}));
    setSearchTerm('');
  };

  // Handle delete
  const handleDelete = async (item) => {
    try {
      // Handle different ID field names for different entities
      const id = item.id || item[`${entityName}_id`] || item.project_id || item.agency_id || item.location_id || item.focal_area_id || item.funding_source_id;
      await apiService.delete(id);
      await fetchData();
      setDeleteModal({ isOpen: false, item: null });
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Prepare table columns with status rendering
  const tableColumns = columns.map(col => {
    // If column already has a custom render function, preserve it
    if (col.render) {
      return col;
    }
    
    // Otherwise, apply default rendering based on type
    return {
      ...col,
      render: (value, row) => {
        if (col.type === 'status') {
          const config = getStatusConfig(value, col.statusType || 'project');
          return <Badge variant="custom" className={config.color} icon={config.icon}>{config.label}</Badge>;
        }
        if (col.type === 'currency') {
          return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits: 0 
          }).format(value);
        }
        if (col.type === 'date') {
          return value ? new Date(value).toLocaleDateString() : '-';
        }
        return value || '-';
      }
    };
  });

  // Prepare table actions
  const defaultActions = [
    {
      label: 'Edit',
      icon: <Edit size={14} />,
      variant: 'outline',
      onClick: (row) => {
        let id;
        if (entityName === 'agency') {
          id = row.agency_id;
        } else if (entityName === 'project') {
          id = row.project_id;
        } else if (entityName === 'location') {
          id = row.location_id;
        } else if (entityName === 'funding-source') {
          id = row.funding_source_id;
        } else if (entityName === 'focal-area') {
          id = row.focal_area_id;
        } else if (entityName === 'user') {
          id = row.id;
        } else {
          id = row.id || row[`${entityName}_id`];
        }
        if (!id) {
          alert(`Cannot edit ${entityName}: No valid ID found`);
          return;
        }
        navigate(`/admin/${entityName}s/${id}/edit`);
      }
    },
    {
      label: 'Delete',
      icon: <Trash2 size={14} />,
      variant: 'outline',
      onClick: (row) => setDeleteModal({ isOpen: true, item: row }),
      className: 'text-red-600 border-red-300 hover:bg-red-50'
    }
  ];

  // If getRowActions is provided and returns actions, use those; otherwise use defaultActions
  const customActions = getRowActions(defaultActions);
  const tableActions = customActions.length > 0 ? customActions : defaultActions;

  if (isLoading) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="flex justify-center items-center min-h-64">
          <Loading size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <ErrorState
          title={`Failed to load ${entityName}s`}
          message={error}
          onRefresh={fetchData}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      <AdminPageHeader 
        title={title}
        subtitle={subtitle}
        onLogout={logout}
      />

      {/* Controls */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            All {title} ({filteredData.length})
          </h3>
          <Button 
            onClick={onAddNew || (() => navigate(`/admin/${entityName}s/new`))}
            variant="primary"
            leftIcon={<Plus size={16} />}
            className="bg-purple-600 hover:bg-purple-700 text-white mt-4 md:mt-0"
          >
            Add {entityName.charAt(0).toUpperCase() + entityName.slice(1)}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <select
                  key={filter.key}
                  value={activeFilters[filter.key]}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))}
              
              {(searchTerm || Object.values(activeFilters).some(v => v !== 'All')) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
            </div>
          )}
        </div>

        {additionalFilters}
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredData}
        columns={tableColumns}
        actions={tableActions}
        searchable={false} // We handle search above
        onRowClick={onRowClick}
        emptyState={customEmptyState || (
          <ErrorState
            type="empty"
            title={`No ${entityName}s found`}
            message={`No ${entityName}s match your search criteria.`}
            showRefresh={false}
          />
        )}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={() => handleDelete(deleteModal.item)}
        title={`Delete ${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`}
        message={`Are you sure you want to delete this ${entityName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </PageLayout>
  );
};

export default AdminListPage;