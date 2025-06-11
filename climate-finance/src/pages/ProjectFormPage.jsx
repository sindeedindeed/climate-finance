import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { adminProjects, agencies, fundingSources, locations, focalAreas } from '../data/mock/adminData';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import ProjectFormSections from '../features/admin/ProjectFormSections';
import { ArrowLeft } from 'lucide-react';

const defaultFormData = {
  project_id: '',
  title: '',
  type: '',
  status: '',
  total_cost_usd: '',
  gef_grant: '',
  cofinancing: '',
  beginning: '',
  closing: '',
  approval_fy: '',
  beneficiaries: '',
  objectives: '',
  agencies: [],
  funding_sources: [],
  funding_source_details: '',
  locations: [],
  focal_areas: [],
  wash_component: {
    presence: false,
    water_supply_percent: 0,
    sanitation_percent: 0,
    public_admin_percent: 0
  }
};

const ProjectFormPage = ({
  mode = 'add',
  initialFormData = defaultFormData,
  onSubmit: onSubmitProp,
  isLoading: isLoadingProp = false,
  pageTitle,
  pageSubtitle
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelectChange = (e, field) => {
    const selectedValues = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
    setFormData(prev => ({
      ...prev,
      [field]: selectedValues
    }));
  };

  const handleWashComponentChange = (washData) => {
    setFormData(prev => ({
      ...prev,
      wash_component: typeof washData === 'function' ? washData(prev.wash_component) : washData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (onSubmitProp) {
      await onSubmitProp(formData, setIsLoading);
      return;
    }
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const projectData = {
        ...formData,
        total_cost_usd: parseFloat(formData.total_cost_usd) || 0,
        gef_grant: parseFloat(formData.gef_grant) || 0,
        cofinancing: parseFloat(formData.cofinancing) || 0,
        approval_fy: parseInt(formData.approval_fy) || new Date().getFullYear()
      };
      if (mode === 'add') {
        console.log('New project data:', projectData);
      } else {
        console.log('Updated project data:', projectData);
      }
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/admin/projects" className="text-purple-600 hover:text-purple-700 transition-colors duration-200">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{pageTitle || (mode === 'add' ? 'Add New Project' : 'Edit Project')}</h2>
            <p className="text-gray-500">{pageSubtitle || (mode === 'add' ? 'Create a new climate finance project' : `Update project details${formData.title ? ` for ${formData.title}` : ''}`)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
      {/* Form Card */}
      <Card padding={true}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            {/* Title field - full width */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project ID: Only show in edit mode */}
              {mode === 'edit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project ID</label>
                  <input
                    type="text"
                    name="project_id"
                    value={formData.project_id}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    disabled
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">Project ID cannot be changed</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Adaptation">Adaptation</option>
                  <option value="Mitigation">Mitigation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
          </div>
          <ProjectFormSections
            formData={formData}
            handleInputChange={handleInputChange}
            handleMultiSelectChange={handleMultiSelectChange}
            handleWashComponentChange={handleWashComponentChange}
            agencies={agencies}
            fundingSources={fundingSources}
            locations={locations}
            focalAreas={focalAreas}
          />
          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Cost (USD)</label>
                <input
                  type="number"
                  name="total_cost_usd"
                  value={formData.total_cost_usd}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
          {/* Timeline */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Beginning Date</label>
                <input
                  type="date"
                  name="beginning"
                  value={formData.beginning}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Closing Date</label>
                <input
                  type="date"
                  name="closing"
                  value={formData.closing}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Approval FY</label>
                <input
                  type="number"
                  name="approval_fy"
                  value={formData.approval_fy}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  min="2000"
                  max="2030"
                />
              </div>
            </div>
          </div>
          {/* Objectives and Beneficiaries */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Objectives & Beneficiaries</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Beneficiaries</label>
                <input
                  type="text"
                  name="beneficiaries"
                  value={formData.beneficiaries}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 2,500,000 coastal residents"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Objectives</label>
                <textarea
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe the project objectives..."
                />
              </div>
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              onClick={() => navigate('/admin/projects')}
              variant="outline"
              disabled={isLoading || isLoadingProp}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
              disabled={isLoading || isLoadingProp}
            >
              {(isLoading || isLoadingProp) ? <Loading size="sm" /> : (mode === 'add' ? 'Create Project' : 'Update Project')}
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};

export default ProjectFormPage;
