import React from 'react';
import { User } from 'lucide-react';
import AdminListPage from '../features/admin/AdminListPage';
import { authApi } from '../services/api';
import Badge from '../components/ui/Badge';
import { getStatusConfig } from '../utils/statusConfig';

const AdminUsers = () => {
  const columns = [
    {
      key: 'username',
      header: 'Username',
      searchKey: 'username'
    },
    {
      key: 'email',
      header: 'Email',
      searchKey: 'email'
    },
    {
      key: 'role',
      header: 'Role',
      render: (value) => {
        const config = getStatusConfig(value, 'user');
        return <Badge variant="custom" className={config.color} icon={config.icon}>{config.label}</Badge>;
      }
    },
    {
      key: 'department',
      header: 'Department',
      searchKey: 'department'
    },
    {
      key: 'active',
      header: 'Status',
      render: (value) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const filters = [
    {
      key: 'role',
      defaultValue: 'All',
      options: [
        { value: 'All', label: 'All Roles' },
        { value: 'Super Admin', label: 'Super Admin (Full Access)' },
        { value: 'Project Manager', label: 'Admin (Basic Access)' },
        { value: 'Finance Admin', label: 'Admin (Basic Access)' },
        { value: 'Data Manager', label: 'Admin (Basic Access)' }
      ]
    }
  ];

  return (
    <AdminListPage
      title="User Management"
      subtitle="Manage admin users and permissions"
      apiService={authApi}
      entityName="user"
      columns={columns}
      searchPlaceholder="Search users..."
      filters={filters}
    />
  );
};

export default AdminUsers;