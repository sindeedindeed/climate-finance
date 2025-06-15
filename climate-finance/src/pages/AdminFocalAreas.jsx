import React from 'react';
import { Target } from 'lucide-react';
import AdminListPage from '../features/admin/AdminListPage';
import { focalAreaApi } from '../services/api';

const AdminFocalAreas = () => {
  const columns = [
    {
      key: 'focal_area_id',
      header: 'Focal Area ID',
      searchKey: 'focal_area_id'
    },
    {
      key: 'name',
      header: 'Name',
      searchKey: 'name'
    }
  ];

  return (
    <AdminListPage
      title="Focal Areas Management"
      subtitle="Manage project focal areas and sectors"
      apiService={focalAreaApi}
      entityName="focal-area"
      columns={columns}
      searchPlaceholder="Search focal areas..."
      filters={[]}
    />
  );
};

export default AdminFocalAreas;