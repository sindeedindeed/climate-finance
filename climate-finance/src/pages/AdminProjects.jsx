import React from 'react';
import { FolderTree } from 'lucide-react';
import AdminListPage from '../features/admin/AdminListPage';
import { projectApi } from '../services/api';

const AdminProjects = () => {
  const columns = [
    {
      key: 'project_id',
      header: 'Project ID',
      searchKey: 'project_id'
    },
    {
      key: 'title',
      header: 'Title',
      searchKey: 'title'
    },
    {
      key: 'status',
      header: 'Status',
      type: 'status',
      statusType: 'project'
    },
    {
      key: 'type',
      header: 'Type',
      render: (value) => {
        // Project types like "Adaptation", "Mitigation" should be displayed directly
        if (!value) return '-';
        const colorClass = value === 'Adaptation' ? 'bg-blue-100 text-blue-800' : 
                          value === 'Mitigation' ? 'bg-green-100 text-green-800' : 
                          'bg-purple-100 text-purple-800';
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'total_cost_usd',
      header: 'Total Cost',
      type: 'currency'
    },
    {
      key: 'beginning',
      header: 'Start Date',
      type: 'date'
    },
    {
      key: 'closing',
      header: 'End Date',
      type: 'date'
    }
  ];

  const filters = [
    {
      key: 'status',
      defaultValue: 'All',
      options: [
        { value: 'All', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Under Implementation', label: 'Under Implementation' },
        { value: 'Cancelled', label: 'Cancelled' }
      ]
    },
    {
      key: 'type',
      defaultValue: 'All',
      options: [
        { value: 'All', label: 'All Types' },
        { value: 'Full Size', label: 'Full Size' },
        { value: 'Medium Size', label: 'Medium Size' },
        { value: 'Enabling Activity', label: 'Enabling Activity' }
      ]
    }
  ];

  return (
    <AdminListPage
      title="Project Management"
      subtitle="Add, edit, and manage climate projects"
      apiService={projectApi}
      entityName="project"
      columns={columns}
      searchPlaceholder="Search projects..."
      filters={filters}
    />
  );
};

export default AdminProjects;