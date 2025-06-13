import React from 'react';
import { User } from 'lucide-react';
import AdminListPage from '../features/admin/AdminListPage';
import { userApi } from '../services/api';
import Badge from '../components/ui/Badge';
import { getStatusConfig } from '../utils/statusConfig';

const AdminUsers = () => {
  const columns = [
    {
      key: 'full_name',
      header: 'Full Name',
      searchKey: 'full_name'
    },
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
      key: 'created_at',
      header: 'Created',
      type: 'date'
    }
  ];

  const filters = [
    {
      key: 'role',
      defaultValue: 'All',
      options: [
        { value: 'All', label: 'All Roles' },
        { value: 'Super Admin', label: 'Super Admin' },
        { value: 'Project Manager', label: 'Project Manager' },
        { value: 'Finance Admin', label: 'Finance Admin' }
      ]
    }
  ];

  return (
    <AdminListPage
      title="User Management"
      subtitle="Manage admin users and permissions"
      apiService={userApi}
      entityName="user"
      columns={columns}
      searchPlaceholder="Search users..."
      filters={filters}
    />
  );
};

export default AdminUsers;