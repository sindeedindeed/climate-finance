import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { locationApi, agencyApi, fundingSourceApi, focalAreaApi, projectApi } from '../services/api';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import ProjectFormSections from '../features/admin/ProjectFormSections';
import { ArrowLeft, FolderTree } from 'lucide-react';

const defaultFormData = {
  project_id: '',
  title: '',
  type: '',
  sector: '',
  division: '',
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
  locations: [],
  focal_areas: [],
  wash_component: {
    presence: false,
    water_supply_percent: 0,
    sanitation_percent: 0,
    public_admin_percent: 0
  },
  disbursement: ''
};

const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toISOString().slice(0, 10);
};

const ProjectFormPage = ({
  mode = 'add',
  pageTitle,
  pageSubtitle
}) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [locations, setLocations] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [fundingSources, setFundingSources] = useState([]);
  const [focalAreas, setFocalAreas] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // Determine mode based on params if not explicitly provided
  const actualMode = mode === 'edit' || id ? 'edit' : 'add';

  // Fetch project data for edit mode
  useEffect(() => {
    if (actualMode === 'edit' && id) {
      fetchProject();
    }
  }, [actualMode, id]);

  // Fetch all required data from APIs
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchProject = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const response = await projectApi.getById(id);
      if (response.status && response.data) {
        const projectData = response.data;
        setFormData({
          project_id: projectData.project_id,
          title: projectData.title,
          type: projectData.type,
          sector: projectData.sector || '',
          division: projectData.division || '',
          status: projectData.status,
          total_cost_usd: projectData.total_cost_usd,
          gef_grant: projectData.gef_grant,
          cofinancing: projectData.cofinancing,
          beginning: formatDateForInput(projectData.beginning),
          closing: formatDateForInput(projectData.closing),
          approval_fy: projectData.approval_fy,
          beneficiaries: projectData.beneficiaries || '',
          objectives: projectData.objectives || '',
          agencies: projectData.agencies || [],
          funding_sources: projectData.funding_sources || [],
          locations: projectData.locations || [],
          focal_areas: projectData.focal_areas || [],
          wash_component: projectData.wash_component || {
            presence: false,
            water_supply_percent: 0,
            sanitation_percent: 0,
            public_admin_percent: 0
          },
          disbursement: projectData.disbursement || ''
        });
      } else {
        throw new Error('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project data');
    } finally {
      setIsFetching(false);
    }
  };

  const fetchAllData = async () => {
    try {
      setIsLoadingData(true);
      
      // Fetch all data in parallel
      const [locationsResponse, agenciesResponse, fundingSourcesResponse, focalAreasResponse] = await Promise.all([
        locationApi.getAll().catch(() => ({ status: false, data: [] })),
        agencyApi.getAll().catch(() => ({ status: false, data: [] })),
        fundingSourceApi.getAll().catch(() => ({ status: false, data: [] })),
        focalAreaApi.getAll().catch(() => ({ status: false, data: [] }))
      ]);

      // Set data or fallback to empty arrays if API calls fail
      setLocations(locationsResponse.status && locationsResponse.data ? locationsResponse.data : []);
      setAgencies(agenciesResponse.status && agenciesResponse.data ? agenciesResponse.data : []);
      setFundingSources(fundingSourcesResponse.status && fundingSourcesResponse.data ? fundingSourcesResponse.data : []);
      setFocalAreas(focalAreasResponse.status && focalAreasResponse.data ? focalAreasResponse.data : []);
      
    } catch (error) {
      console.error('Error fetching form data:', error);
      // Set empty arrays as fallback
      setLocations([]);
      setAgencies([]);
      setFundingSources([]);
      setFocalAreas([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.type) {
      newErrors.type = 'Project type is required';
    }

    if (!formData.sector) {
      newErrors.sector = 'Project sector is required';
    }

    if (!formData.division) {
      newErrors.division = 'Project division is required';
    }

    if (!formData.status) {
      newErrors.status = 'Project status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const totalCost = parseFloat(formData.total_cost_usd) || 0;
      const gefGrant = parseFloat(formData.gef_grant) || 0;
      const cofinancing = parseFloat(formData.cofinancing) || 0;
      
      // Calculate WASH finance based on WASH component presence and total cost
      const washFinance = formData.wash_component.presence 
        ? totalCost * (
            (formData.wash_component.water_supply_percent || 0) + 
            (formData.wash_component.sanitation_percent || 0) + 
            (formData.wash_component.public_admin_percent || 0)
          ) / 100
        : 0;
      
      // Calculate WASH finance percentage
      const washFinancePercent = totalCost > 0 ? (washFinance / totalCost) * 100 : 0;

      // Create clean project data object
      const projectData = {
        title: formData.title,
        type: formData.type,
        sector: formData.sector,
        division: formData.division,
        status: formData.status,
        total_cost_usd: totalCost,
        gef_grant: gefGrant,
        cofinancing: cofinancing,
        beginning: formData.beginning,
        closing: formData.closing,
        approval_fy: parseInt(formData.approval_fy) || new Date().getFullYear(),
        beneficiaries: formData.beneficiaries,
        objectives: formData.objectives,
        wash_finance: washFinance,
        wash_finance_percent: washFinancePercent,
        wash_component: formData.wash_component,
        disbursement: parseFloat(formData.disbursement) || 0,
        // Transform relationship arrays to match backend expectations
        agency_ids: formData.agencies || [],
        location_ids: formData.locations || [],
        funding_source_ids: formData.funding_sources || [],
        focal_area_ids: formData.focal_areas || []
      };

      if (actualMode === 'add') {
        await projectApi.add(projectData);
      } else {
        await projectApi.update(id, projectData);
      }

      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      setError(error.message || 'Failed to save project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData || isFetching) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="flex justify-center items-center min-h-64">
          <Loading size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (error && actualMode === 'edit') {
    return (
      <PageLayout bgColor="bg-gray-50">
        <Card padding={true}>
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <FolderTree size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
            <p className="text-gray-500 mb-4">
              The project you're looking for could not be found.
            </p>
            <Button onClick={() => navigate('/admin/projects')} variant="primary">
              Back to Projects
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/admin/projects" className="text-purple-600 hover:text-purple-700 transition-colors duration-200">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {pageTitle || (actualMode === 'add' ? 'Add New Project' : 'Edit Project')}
            </h2>
            <p className="text-gray-500">
              {pageSubtitle || (actualMode === 'add' ? 'Create a new climate finance project' : `Update project details${formData.title ? ` for ${formData.title}` : ''}`)}
            </p>
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
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title field - one column */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              
              {/* Project ID: Only show in edit mode */}
              {actualMode === 'edit' && (
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
                <label className="block text-sm font-medium text-gray-700">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.type ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Adaptation">Adaptation</option>
                  <option value="Mitigation">Mitigation</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sector <span className="text-red-500">*</span>
                </label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.sector ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Sector</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Water">Water</option>
                  <option value="Energy">Energy</option>
                  <option value="Transport">Transport</option>
                  <option value="Urban">Urban</option>
                  <option value="Forestry">Forestry</option>
                  <option value="Coastal">Coastal</option>
                  <option value="Disaster Risk Management">Disaster Risk Management</option>
                  <option value="Disaster Risk Reduction">Disaster Risk Reduction</option>
                  <option value="Health">Health</option>
                  <option value="Cross-cutting">Cross-cutting</option>
                </select>
                {errors.sector && (
                  <p className="mt-1 text-sm text-red-600">{errors.sector}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Division <span className="text-red-500">*</span>
                </label>
                <select
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.division ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Division</option>
                  <option value="Local Government">Local Government</option>
                  <option value="National Government">National Government</option>
                  <option value="NGO">NGO</option>
                  <option value="International">International</option>
                </select>
                {errors.division && (
                  <p className="mt-1 text-sm text-red-600">{errors.division}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.status ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Suspended">Suspended</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
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
              
              {/* Disbursement field - Only show in edit mode */}
              {actualMode === 'edit' && (
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Disbursement (USD)
                    <span className="text-sm text-gray-500 ml-1">(Amount already disbursed from funding sources)</span>
                  </label>
                  <input
                    type="number"
                    name="disbursement"
                    value={formData.disbursement || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    step="0.01"
                    min="0"
                    placeholder="Enter disbursed amount..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This field tracks the actual amount disbursed from the funding sources for this project.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Beginning Date</label>
                <input
                  type="date"
                  name="beginning"
                  value={formatDateForInput(formData.beginning)}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Closing Date</label>
                <input
                  type="date"
                  name="closing"
                  value={formatDateForInput(formData.closing)}
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading 
                ? (actualMode === 'add' ? 'Creating...' : 'Updating...') 
                : (actualMode === 'add' ? 'Create Project' : 'Update Project')
              }
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};

export default ProjectFormPage;
