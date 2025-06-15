import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import ProgressBar from '../components/ui/ProgressBar';
import FinancialSummaryCard from '../components/ui/FinancialSummaryCard';
import { formatCurrency } from '../utils/formatters';
import { projectApi } from '../services/api';

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
      fetchProject();
    } else {
      setError('No project ID provided');
      setLoading(false);
    }
  }, [actualId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await projectApi.getById(actualId);
      if (response.status && response.data) {
        setProject(response.data);
        setRetryCount(0);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message || 'Error loading project data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchProject();
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

  const getStatusIcon = (status) => {
    return null;
  };

  const calculateProgress = () => {
    const total = getTotalBudget(project);
    const disbursed = project.disbursement || 0;
    if (total > 0) {
      return Math.round((disbursed / total) * 100);
    }
    return project.progress || 0;
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

        <Card className="mb-6 overflow-visible" padding={true}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${getStatusColor(project.status)}`}
              >
                {getStatusIcon(project.status)}
                {project.status}
              </span>
              <span className="text-xs text-gray-400">{project.project_id}</span>
            </div>

            <div className="flex flex-col md:flex-row md:gap-8">
              <div className="w-full md:w-3/5">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {project.title || 'Untitled Project'}
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  {project.objectives || project.description || 'No description available'}
                </p>

                {getTotalBudget(project) > 0 && (
                  <ProgressBar
                    label="Financial Progress"
                    percentage={progressPercentage}
                    current={project.disbursement || 0}
                    total={getTotalBudget(project)}
                    formatValue={formatCurrency}
                    color="purple"
                  />
                )}
              </div>

              <div className="w-full md:w-2/5 mt-6 md:mt-0">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
                    onClick={handleExportReport}
                    leftIcon={<Download size={16} />}
                  >
                    Export Report
                  </Button>
                </div>

                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div>
                      <span className="font-semibold">Project Timeline</span>
                      <div className="text-xs text-gray-600">
                        {getTimeline(project)}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div>
                      <span className="font-semibold">Locations</span>
                      <div className="text-xs text-gray-600">
                        {getLocation(project)}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div>
                      <span className="font-semibold">Total Budget</span>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(getTotalBudget(project))}
                      </div>
                    </div>
                  </li>
                  {project.beneficiaries && (
                    <li className="flex items-start gap-2">
                      <div>
                        <span className="font-semibold">Beneficiaries</span>
                        <div className="text-xs text-gray-600">
                          {project.beneficiaries}
                        </div>
                      </div>
                    </li>
                  )}
                  {project.sector && (
                    <li className="flex items-start gap-2">
                      <div>
                        <span className="font-semibold">Sector</span>
                        <div className="text-xs text-gray-600">
                          {project.sector}
                        </div>
                      </div>
                    </li>
                  )}
                  {project.wash_component?.presence && (
                    <li className="flex items-start gap-2">
                      <div>
                        <span className="font-semibold">WASH Component</span>
                        <div className="text-xs text-gray-600">
                          Included in this project
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-6" padding={true}>
          <div>
            <div className="font-semibold mb-4">
              Implementing & Executing Agencies
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(project.projectAgencies) && project.projectAgencies.length > 0 ? (
                project.projectAgencies.map((agency, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {agency.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {agency.type} • {agency.category}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No agencies information available
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="mb-6" padding={true}>
          <div>
            <div className="font-semibold mb-4">Funding Sources</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(project.projectFundingSources) && project.projectFundingSources.length > 0 ? (
                project.projectFundingSources.map((source, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        {source.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {source.dev_partner}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No funding source information available
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="mb-6" padding={true}>
          <div>
            <div className="font-semibold mb-4">Project Locations</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.isArray(project.projectLocations) && project.projectLocations.length > 0 ? (
                project.projectLocations.map((location, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        {location.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {location.region}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No location information available
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="mb-6" padding={true}>
          <div>
            <div className="font-semibold mb-4">Focal Areas</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.isArray(project.projectFocalAreas) && project.projectFocalAreas.length > 0 ? (
                project.projectFocalAreas.map((area, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3"
                  >
                    <div>
                      <div className="font-medium text-sm">{area.name}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No focal area information available
                </div>
              )}
            </div>
          </div>
        </Card>

        {project.wash_component?.presence && (
          <Card className="mb-6" padding={true}>
            <div>
              <div className="font-semibold mb-4">WASH Component Details</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="text-sm font-medium mb-1">Water Supply</div>
                  <div className="text-xs text-gray-500">
                    {project.wash_component.water_supply_percent || 0}%
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="text-sm font-medium mb-1">Sanitation</div>
                  <div className="text-xs text-gray-500">
                    {project.wash_component.sanitation_percent || 0}%
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="text-sm font-medium mb-1">
                    Public Administration
                  </div>
                  <div className="text-xs text-gray-500">
                    {project.wash_component.public_admin_percent || 0}%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card className="mb-6" padding={true}>
          <div>
            <div className="font-semibold mb-4">Financial Summary</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FinancialSummaryCard
                title="Total Cost"
                value={formatCurrency(getTotalBudget(project))}
                color="purple"
              />
              <FinancialSummaryCard
                title="GEF Grant"
                value={formatCurrency(project.gef_grant || 0)}
                color="green"
              />
              <FinancialSummaryCard
                title="Co-financing"
                value={formatCurrency(project.cofinancing || 0)}
                color="blue"
              />
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ProjectDetails;
