import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { adminProjects } from '../data/mock/adminData';
import { formatCurrency, formatDate } from '../utils/formatters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import { ArrowLeft, Search, Edit, Trash2, Plus, Calendar, DollarSign, MapPin, Users } from 'lucide-react';

const AdminProjects = () => {
  const { user, logout } = useAuth();
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
      case 'Cross-cutting': return 'bg-purple-100 text-purple-800';
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

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard" className="text-purple-600 hover:text-purple-700 transition-colors duration-200">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Project Management</h2>
            <p className="text-gray-500">Add, edit, and manage climate projects</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>

      {/* Controls Card */}
      <Card hover className="mb-6" padding={true}>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              All Projects ({filteredProjects.length})
            </h3>
            
            <Button 
              onClick={() => navigate('/admin/projects/add')} 
              variant="primary"
              leftIcon={<Plus size={16} />}
              className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 mt-4 md:mt-0"
            >
              Add Project
            </Button>
          </div>
          
          {/* Search and filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="border border-gray-300 rounded-xl text-sm py-2.5 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {projectTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Types' : type}
                  </option>
                ))}
              </select>
              
              <select
                className="border border-gray-300 rounded-xl text-sm py-2.5 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {projectStatuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Projects Grid - Fixed alignment and card structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <Card 
            key={project.project_id} 
            hover 
            padding={true}
            className="group cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Card content with proper flex layout for equal heights */}
            <div className="flex flex-col h-full">
              {/* Header - Fixed height */}
              <div className="flex justify-between items-start mb-4 min-h-[60px]">
                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-500 font-mono">{project.project_id}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getTypeColor(project.type)}`}>
                    {project.type}
                  </span>
                </div>
              </div>
              
              {/* Key Info - Flexible content area */}
              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={14} className="mr-2 text-purple-500 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                  <span className="truncate">{formatDate(project.beginning)} - {formatDate(project.closing)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign size={14} className="mr-2 text-purple-500 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                  <span className="truncate">{formatCurrency(project.total_cost_usd)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={14} className="mr-2 text-purple-500 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                  <span className="truncate">FY {project.approval_fy}</span>
                </div>
                {project.beneficiaries && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-2 text-purple-500 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                    <span className="truncate">{project.beneficiaries}</span>
                  </div>
                )}
              </div>
              
              {/* Actions - Fixed at bottom */}
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs text-gray-500 truncate pr-2">
                    GEF: {formatCurrency(project.gef_grant)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/admin/projects/edit/${project.project_id}`)}
                    size="sm"
                    variant="outline"
                    leftIcon={<Edit size={14} />}
                    className="flex-1 text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-200"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.project_id)}
                    size="sm"
                    variant="outline"
                    leftIcon={<Trash2 size={14} />}
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-all duration-200"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <Card padding={true}>
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">
              No projects match your search criteria. Try adjusting your filters.
            </p>
          </div>
        </Card>
      )}
    </PageLayout>
  );
};

export default AdminProjects;