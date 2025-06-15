import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  AlertCircle,
  RefreshCw,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Building,
  CheckCircle,
  TrendingUp,
  Droplets
} from 'lucide-react';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import ProgressBar from '../components/ui/ProgressBar';
import FinancialSummaryCard from '../components/ui/FinancialSummaryCard';
import { formatCurrency } from '../utils/formatters';
import { projectApi, locationApi, agencyApi, fundingSourceApi, focalAreaApi } from '../services/api';

const ProjectDetails = () => {
  const { id, projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const actualId = id || projectId;

  useEffect(() => {
    if (actualId) {
      fetchProjectWithRelatedData();
    } else {
      setError('No project ID provided');
      setLoading(false);
    }
  }, [actualId]);

  const fetchProjectWithRelatedData = async () => {
    try {
      setLoading(true);
      setError(null);

      const projectResponse = await projectApi.getById(actualId);
      if (!projectResponse?.status || !projectResponse.data) {
        setError('Project not found');
        return;
      }

      const projectData = projectResponse.data;

      const [agenciesData, locationsData, fundingSourcesData, focalAreasData] = await Promise.all([
        projectData.agencies && projectData.agencies.length > 0 
          ? Promise.all(projectData.agencies.map(id => 
              agencyApi.getById(id).catch(() => null)
            ))
          : Promise.resolve([]),
        projectData.locations && projectData.locations.length > 0
          ? Promise.all(projectData.locations.map(id => 
              locationApi.getById(id).catch(() => null)
            ))
          : Promise.resolve([]),
        projectData.funding_sources && projectData.funding_sources.length > 0
          ? Promise.all(projectData.funding_sources.map(id => 
              fundingSourceApi.getById(id).catch(() => null)
            ))
          : Promise.resolve([]),
        projectData.focal_areas && projectData.focal_areas.length > 0
          ? Promise.all(projectData.focal_areas.map(id => 
              focalAreaApi.getById(id).catch(() => null)
            ))
          : Promise.resolve([])
      ]);

      const projectAgencies = agenciesData
        .filter(response => response?.status && response.data)
        .map(response => response.data);
      
      const projectLocations = locationsData
        .filter(response => response?.status && response.data)
        .map(response => response.data);
      
      const projectFundingSources = fundingSourcesData
        .filter(response => response?.status && response.data)
        .map(response => response.data);
      
      const projectFocalAreas = focalAreasData
        .filter(response => response?.status && response.data)
        .map(response => response.data);

      const enrichedProject = {
        ...projectData,
        projectAgencies,
        projectLocations,
        projectFundingSources,
        projectFocalAreas
      };

      setProject(enrichedProject);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message || 'Error loading project data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchProjectWithRelatedData();
  };

  if (loading) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="flex flex-col justify-center items-center min-h-64">
          <Loading size="lg" />
          <p className="mt-4 text-gray-600">Loading project details...</p>
          {retryCount > 0 && (
            <p className="mt-2 text-sm text-gray-500">Retry attempt: {retryCount}</p>
          )}
        </div>
      </PageLayout>
    );
  }

  if (error || !project) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <Card padding={true}>
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <AlertCircle size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error || 'Project Not Found'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {error === 'No project ID provided' 
                ? 'Invalid project ID provided in the URL.'
                : 'The project you\'re looking for doesn\'t exist or couldn\'t be loaded.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleRetry}
                leftIcon={<RefreshCw size={16} />}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Retry
              </Button>
              <Button
                onClick={() => navigate('/projects')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Projects
              </Button>
            </div>
            {retryCount > 2 && (
              <p className="mt-4 text-sm text-gray-500">
                If the problem persists, please contact the system administrator.
              </p>
            )}
          </div>
        </Card>
      </PageLayout>
    );
  }

  const getTimeline = (proj) => {
    if (proj.beginning && proj.closing) {
      return `${new Date(proj.beginning).toLocaleDateString()} - ${new Date(proj.closing).toLocaleDateString()}`;
    }
    return proj.timeline || 'Not specified';
  };

  const getLocation = (proj) => {
    if (Array.isArray(proj.projectLocations) && proj.projectLocations.length > 0) {
      return proj.projectLocations.map(loc => loc.name).join(', ');
    }
    return proj.location || 'Not specified';
  };

  const getTotalBudget = (proj) => {
    return proj.total_cost_usd || proj.totalFunding || proj.totalBudget || 0;
  };

  const handleExportReport = () => {
    const reportData = {
      projectId: project.project_id,
      title: project.title,
      status: project.status,
      description: project.objectives,
      totalBudget: getTotalBudget(project),
      disbursed: project.disbursement || 0,
      progress: project.progress || 0,
      location: getLocation(project),
      timeline: getTimeline(project),
      beneficiaries: project.beneficiaries,
      exportDate: new Date().toISOString().split('T')[0],
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.project_id}_report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Planning': return 'bg-yellow-100 text-yellow-700';
      case 'On Hold': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const calculateProgress = () => {
    const committed = project.gef_grant || 0;
    const disbursed = project.disbursement || 0;
    
    if (committed > 0 && disbursed >= 0) {
      return Math.min(Math.round((disbursed / committed) * 100), 100);
    }
    return 0;
  };

  const progressPercentage = calculateProgress();

  return (
    <PageLayout bgColor="bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            to="/projects"
            className="flex items-center text-purple-600 hover:text-purple-700 transition-colors group"
          >
            <ArrowLeft
              size={18}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            Back to Projects
          </Link>
        </div>

        {/* Main Project Card - Fixed Typography & Colors */}
        <Card className="mb-6" padding="p-4 sm:p-6">
          {/* Top Bar: Status, ID, Export */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className="text-sm text-gray-500 font-medium">#{project.project_id}</span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportReport}
              leftIcon={<Download size={14} />}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Export Report
            </Button>
          </div>

          {/* Title and Description */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
              {project.title || 'Untitled Project'}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              {project.objectives || project.description || 'No description available'}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Budget</div>
              <div className="text-base sm:text-lg font-bold text-gray-900">{formatCurrency(getTotalBudget(project))}</div>
            </div>
            
            {project.gef_grant && (
              <div className="text-center">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">GEF Grant</div>
                <div className="text-base sm:text-lg font-bold text-success-600">{formatCurrency(project.gef_grant)}</div>
              </div>
            )}
            
            {project.disbursement && project.disbursement > 0 && (
              <div className="text-center">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Disbursed</div>
                <div className="text-base sm:text-lg font-bold text-primary-600">{formatCurrency(project.disbursement)}</div>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Location</div>
              <div className="text-sm font-semibold text-gray-900 truncate" title={getLocation(project)}>
                {getLocation(project)}
              </div>
            </div>
          </div>

          {/* Mini Progress Bar */}
          {project.gef_grant > 0 && project.disbursement > 0 && (
            <div className="mb-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-800">Disbursement Progress</span>
                <span className="text-sm font-bold text-primary-700">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{formatCurrency(project.disbursement)}</span>
                <span>{formatCurrency(project.gef_grant)}</span>
              </div>
            </div>
          )}

          {/* Timeline and Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
            <div>
              <span className="font-semibold text-gray-800">Timeline:</span>
              <span className="text-gray-600 ml-2">{getTimeline(project)}</span>
            </div>
            
            {project.beneficiaries && (
              <div>
                <span className="font-semibold text-gray-800">Beneficiaries:</span>
                <span className="text-gray-600 ml-2">{project.beneficiaries}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Secondary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Agencies */}
          <Card padding="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementing Agencies</h3>
            {Array.isArray(project.projectAgencies) && project.projectAgencies.length > 0 ? (
              <div className="space-y-3">
                {project.projectAgencies.slice(0, 4).map((agency, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{agency.name}</div>
                    <div className="text-sm text-gray-500 font-medium">{agency.type}</div>
                  </div>
                ))}
                {project.projectAgencies.length > 4 && (
                  <div className="text-sm text-gray-500 text-center font-medium">
                    +{project.projectAgencies.length - 4} more agencies
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building size={24} className="mx-auto mb-2" />
                <p className="font-medium">No agencies data</p>
              </div>
            )}
          </Card>

          {/* Funding Sources */}
          <Card padding="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Sources</h3>
            {Array.isArray(project.projectFundingSources) && project.projectFundingSources.length > 0 ? (
              <div className="space-y-3">
                {project.projectFundingSources.slice(0, 4).map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-100">
                    <div className="font-medium text-gray-900">{source.name}</div>
                    <div className="text-sm text-primary-700 font-medium">{source.dev_partner}</div>
                  </div>
                ))}
                {project.projectFundingSources.length > 4 && (
                  <div className="text-sm text-gray-500 text-center font-medium">
                    +{project.projectFundingSources.length - 4} more sources
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign size={24} className="mx-auto mb-2" />
                <p className="font-medium">No funding sources</p>
              </div>
            )}
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Locations */}
          <Card padding="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Locations</h3>
            {Array.isArray(project.projectLocations) && project.projectLocations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.projectLocations.map((location, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-success-100 text-success-800 text-sm rounded-lg font-medium"
                  >
                    {location.name}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin size={24} className="mx-auto mb-2" />
                <p className="font-medium">No locations</p>
              </div>
            )}
          </Card>

          {/* Focal Areas */}
          <Card padding="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Focal Areas</h3>
            {Array.isArray(project.projectFocalAreas) && project.projectFocalAreas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.projectFocalAreas.map((area, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-primary-100 text-primary-800 text-sm rounded-lg font-medium"
                  >
                    {area.name}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle size={24} className="mx-auto mb-2" />
                <p className="font-medium">No focal areas</p>
              </div>
            )}
          </Card>
        </div>

        {/* WASH Component */}
        {project.wash_component?.presence && (
          <Card padding="p-4 sm:p-6" className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">WASH Component</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-100">
                <div className="text-sm text-gray-600 font-medium mb-1">Water Supply</div>
                <div className="text-xl font-bold text-primary-700">
                  {project.wash_component.water_supply_percent || 0}%
                </div>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-lg border border-success-100">
                <div className="text-sm text-gray-600 font-medium mb-1">Sanitation</div>
                <div className="text-xl font-bold text-success-700">
                  {project.wash_component.sanitation_percent || 0}%
                </div>
              </div>
              <div className="text-center p-4 bg-warning-50 rounded-lg border border-warning-100">
                <div className="text-sm text-gray-600 font-medium mb-1">Public Admin</div>
                <div className="text-xl font-bold text-warning-700">
                  {project.wash_component.public_admin_percent || 0}%
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Financial Summary */}
        <Card padding="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-100">
              <div className="text-sm text-gray-600 font-medium mb-2">Total Cost</div>
              <div className="text-xl font-bold text-primary-700">
                {formatCurrency(getTotalBudget(project))}
              </div>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg border border-success-100">
              <div className="text-sm text-gray-600 font-medium mb-2">GEF Grant</div>
              <div className="text-xl font-bold text-success-700">
                {formatCurrency(project.gef_grant || 0)}
              </div>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg border border-warning-100">
              <div className="text-sm text-gray-600 font-medium mb-2">Co-financing</div>
              <div className="text-xl font-bold text-warning-700">
                {formatCurrency(project.cofinancing || 0)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ProjectDetails;
