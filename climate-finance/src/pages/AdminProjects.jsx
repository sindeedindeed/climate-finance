import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminProjects } from '../data/mock/adminData';
import { formatCurrency, formatDate } from '../utils/formatters';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import AdminPageHeader from '../components/layouts/AdminPageHeader';
import AdminControlsCard from '../components/layouts/AdminControlsCard';
import AdminListItem from '../components/layouts/AdminListItem';
import AdminEmptyState from '../components/layouts/AdminEmptyState';
import { FolderTree } from 'lucide-react';

const AdminProjects = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState(adminProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProjects(prev => prev.filter(p => p.project_id !== projectId));
      } catch (error) {
        console.error('Error deleting project:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Adaptation': return 'bg-blue-100 text-blue-800';
      case 'Mitigation': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const projectTypes = ['All', ...new Set(adminProjects.map(p => p.type))];
  const projectStatuses = ['All', ...new Set(adminProjects.map(p => p.status))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.project_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || project.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filters = [
    {
      value: selectedType,
      onChange: setSelectedType,
      options: projectTypes.map(type => ({
        value: type,
        label: type === 'All' ? 'All Types' : type
      }))
    },
    {
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: projectStatuses.map(status => ({
        value: status,
        label: status === 'All' ? 'All Status' : status
      }))
    }
  ];

  return (
    <PageLayout bgColor="bg-gray-50">
      <AdminPageHeader 
        title="Project Management"
        subtitle="Add, edit, and manage climate projects"
        onLogout={handleLogout}
      />

      <AdminControlsCard
        title="All Projects"
        count={filteredProjects.length}
        searchPlaceholder="Search projects..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonText="Add Project"
        onAddClick={() => navigate('/admin/projects/add')}
        filters={filters}
      />

      <Card hover padding={true}>
        <div className="divide-y divide-gray-100">
          {filteredProjects.map((project, index) => (
            <AdminListItem
              key={project.project_id}
              id={project.project_id}
              icon={<FolderTree size={20} className="text-purple-600" />}
              title={project.title}
              subtitle={project.project_id}
              badge={
                <div className="flex gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(project.type)}`}>
                    {project.type}
                  </span>
                </div>
              }
              dataFields={[
                { label: 'Total Cost', value: formatCurrency(project.total_cost_usd) },
                { label: 'Timeline', value: `${formatDate(project.beginning)} - ${formatDate(project.closing)}` },
                { label: 'Approval FY', value: `FY ${project.approval_fy}` },
                { label: 'GEF Grant', value: formatCurrency(project.gef_grant) }
              ]}
              onEdit={(id) => navigate(`/admin/projects/${id}/edit`)}
              onDelete={handleDelete}
              index={index}
            />
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <AdminEmptyState
            title="No projects found"
            description="No projects match your search criteria. Try adjusting your filters."
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default AdminProjects;