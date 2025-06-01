import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { adminProjects, agencies, fundingSources, locations, focalAreas } from '../data/mock/adminData';
import { formatCurrency, formatDate } from '../utils/formatters';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import { ArrowLeft } from 'lucide-react';

const AdminProjects = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState(adminProjects);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    type: '',
    status: '',
    approval_fy: '',
    beginning: '',
    closing: '',
    total_cost_usd: '',
    gef_grant: '',
    cofinancing: '',
    wash_finance: '',
    wash_finance_percent: '',
    beneficiaries: '',
    objectives: '',
    agencies: [],
    funding_sources: [],
    locations: [],
    focal_areas: [],
    wash_component: {
      presence: false,
      water_supply_percent: '',
      sanitation_percent: '',
      public_admin_percent: ''
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const resetForm = () => {
    setFormData({
      project_id: '',
      title: '',
      type: '',
      status: '',
      approval_fy: '',
      beginning: '',
      closing: '',
      total_cost_usd: '',
      gef_grant: '',
      cofinancing: '',
      wash_finance: '',
      wash_finance_percent: '',
      beneficiaries: '',
      objectives: '',
      agencies: [],
      funding_sources: [],
      locations: [],
      focal_areas: [],
      wash_component: {
        presence: false,
        water_supply_percent: '',
        sanitation_percent: '',
        public_admin_percent: ''
      }
    });
    setEditingProject(null);
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        project_id: project.project_id,
        title: project.title,
        type: project.type,
        status: project.status,
        approval_fy: project.approval_fy,
        beginning: project.beginning,
        closing: project.closing,
        total_cost_usd: project.total_cost_usd,
        gef_grant: project.gef_grant,
        cofinancing: project.cofinancing,
        wash_finance: project.wash_finance,
        wash_finance_percent: project.wash_finance_percent,
        beneficiaries: project.beneficiaries,
        objectives: project.objectives,
        agencies: project.agencies || [],
        funding_sources: project.funding_sources || [],
        locations: project.locations || [],
        focal_areas: project.focal_areas || [],
        wash_component: project.wash_component || {
          presence: false,
          water_supply_percent: '',
          sanitation_percent: '',
          public_admin_percent: ''
        }
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('wash_component.')) {
      const washField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        wash_component: {
          ...prev.wash_component,
          [washField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name];
      const numValue = parseInt(value);
      
      if (currentValues.includes(numValue)) {
        return {
          ...prev,
          [name]: currentValues.filter(v => v !== numValue)
        };
      } else {
        return {
          ...prev,
          [name]: [...currentValues, numValue]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const projectData = {
        ...formData,
        total_cost_usd: parseFloat(formData.total_cost_usd) || 0,
        gef_grant: parseFloat(formData.gef_grant) || 0,
        cofinancing: parseFloat(formData.cofinancing) || 0,
        wash_finance: parseFloat(formData.wash_finance) || 0,
        wash_finance_percent: parseFloat(formData.wash_finance_percent) || 0,
        approval_fy: parseInt(formData.approval_fy) || new Date().getFullYear(),
        wash_component: {
          ...formData.wash_component,
          water_supply_percent: parseFloat(formData.wash_component.water_supply_percent) || 0,
          sanitation_percent: parseFloat(formData.wash_component.sanitation_percent) || 0,
          public_admin_percent: parseFloat(formData.wash_component.public_admin_percent) || 0
        }
      };

      if (editingProject) {
        setProjects(prev => prev.map(p => 
          p.project_id === editingProject.project_id ? projectData : p
        ));
      } else {
        setProjects(prev => [...prev, projectData]);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsLoading(false);
    }
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

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.project_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="text-primary-600 hover:text-primary-700 transition-colors duration-200">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
                <p className="text-sm text-gray-600">Add, edit, and manage climate projects</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => openModal()} className="bg-primary-600 hover:bg-primary-700 text-white">
              Add Project
            </Button>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.project_id} className="hover:bg-primary-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.project_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                          {project.type}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          {project.status}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(project.total_cost_usd)}
                      </div>
                      <div className="text-xs text-gray-500">
                        GEF: {formatCurrency(project.gef_grant)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(project.beginning)} - {formatDate(project.closing)}
                      </div>
                      <div className="text-xs text-gray-500">
                        FY {project.approval_fy}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => openModal(project)}
                          size="sm"
                          variant="outline"
                          className="text-primary-600 border-primary-600 hover:bg-primary-50 hover:text-primary-700"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(project.project_id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No projects found</div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project ID</label>
                    <input
                      type="text"
                      name="project_id"
                      value={formData.project_id}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                      disabled={editingProject}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Adaptation">Adaptation</option>
                      <option value="Mitigation">Mitigation</option>
                      <option value="Cross-cutting">Cross-cutting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Planning">Planning</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Cost (USD)</label>
                    <input
                      type="number"
                      name="total_cost_usd"
                      value={formData.total_cost_usd}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">GEF Grant (USD)</label>
                    <input
                      type="number"
                      name="gef_grant"
                      value={formData.gef_grant}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Co-financing (USD)</label>
                    <input
                      type="number"
                      name="cofinancing"
                      value={formData.cofinancing}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                {/* WASH Component */}
                <div className="border rounded-md p-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="wash_component.presence"
                      checked={formData.wash_component.presence}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">
                      Has WASH Component
                    </label>
                  </div>

                  {formData.wash_component.presence && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Water Supply %</label>
                        <input
                          type="number"
                          name="wash_component.water_supply_percent"
                          value={formData.wash_component.water_supply_percent}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          step="0.01"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sanitation %</label>
                        <input
                          type="number"
                          name="wash_component.sanitation_percent"
                          value={formData.wash_component.sanitation_percent}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          step="0.01"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Public Admin %</label>
                        <input
                          type="number"
                          name="wash_component.public_admin_percent"
                          value={formData.wash_component.public_admin_percent}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          step="0.01"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Objectives and Beneficiaries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Beneficiaries</label>
                    <input
                      type="text"
                      name="beneficiaries"
                      value={formData.beneficiaries}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., 2,500,000 coastal residents"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Approval FY</label>
                    <input
                      type="number"
                      name="approval_fy"
                      value={formData.approval_fy}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      min="2000"
                      max="2030"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Objectives</label>
                  <textarea
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe the project objectives..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button
                    type="button"
                    onClick={closeModal}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loading size="sm" /> : (editingProject ? 'Update Project' : 'Create Project')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;