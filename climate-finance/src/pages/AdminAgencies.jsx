import React, { useState } from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminListPage from '../features/admin/AdminListPage';
import { agencyApi } from '../services/api';

const AdminAgencies = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const columns = [
    {
      key: 'agency_id',
      header: 'Agency ID',
      searchKey: 'agency_id'
    },
    {
      key: 'name',
      header: 'Name',
      searchKey: 'name'
    },
    {
      key: 'type',
      header: 'Type',
      type: 'status',
      statusType: 'agency'
    },
    {
      key: 'category',
      header: 'Category',
      searchKey: 'category',
      render: (value, row) => {
        if (value === null || value === undefined || value === '' || !value) {
          return <span className="text-xs text-gray-400 italic">No category</span>;
        }
        
        return (
          <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
            {value}
          </span>
        );
      }
    }
  ];

  const filters = [
    {
      key: 'type',
      defaultValue: 'All',
      options: [
        { value: 'All', label: 'All Types' },
        { value: 'Implementing', label: 'Implementing' },
        { value: 'Executing', label: 'Executing' },
        { value: 'Accredited', label: 'Accredited' }
      ]
    }
  ];

  const handleAddAgency = () => {
    navigate('/admin/agencies/new');
  };

  const customGetRowActions = (defaultActions) => [
    {
      ...defaultActions[0],
      onClick: (row) => {
        if (!row.agency_id) {
          setError('Error: No agency ID found for this record');
          return;
        }
        navigate(`/admin/agencies/${row.agency_id}/edit`);
      }
    },
    defaultActions[1] // Keep delete action as is
  ];

  const handleError = (errorMessage) => {
    setError(errorMessage);
    console.error('Agency management error:', errorMessage);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle size={20} className="text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
            <button 
              onClick={clearError}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <AdminListPage
        title="Agencies Management"
        subtitle="Manage implementing and executing agencies"
        apiService={agencyApi}
        entityName="agency"
        columns={columns}
        searchPlaceholder="Search agencies..."
        filters={filters}
        getRowActions={customGetRowActions}
        onAddNew={handleAddAgency}
        onError={handleError}
      />
    </>
  );
};

export default AdminAgencies;