import React from 'react';
import { Building2 } from 'lucide-react';
import AdminListPage from '../features/admin/AdminListPage';
import { agencyApi } from '../services/api';

const AdminAgencies = () => {
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
      render: (value) => value || '-'
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

  return (
    <AdminListPage
      title="Agencies Management"
      subtitle="Manage implementing and executing agencies"
      apiService={agencyApi}
      entityName="agency"
      columns={columns}
      searchPlaceholder="Search agencies..."
      filters={filters}
    />
  );
};

export default AdminAgencies;