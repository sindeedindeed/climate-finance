import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Building,
  FileText,
  CheckCircle,
  Clock,
  Target,
  Download,
  AlignLeft,
  Play,
  Pause,
  Droplet,
  Tag,
  FolderOpen,
} from 'lucide-react';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { projectsList } from '../data/mock/projectsData';
import { agencies, fundingSources, locations, focalAreas } from '../data/mock/adminData';
import { projectApi } from '../services/api'; // Fix: Use correct import path

const ProjectDetails = () => {
  const { id, projectId } = useParams(); // Get both possible parameter names
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use whichever parameter is available
  const actualId = id || projectId;

  // Find project from the projects list or use mock project as fallback
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);

        // First try to fetch from API
        if (actualId) {
          try {
            const response = await projectApi.getById(actualId);
            if (response.status && response.data) {
              setProject(response.data);
              setLoading(false);
              return;
            }
          } catch (apiError) {
            console.log('API fetch failed, trying mock data:', apiError);
          }
        }

        // Fallback to mock data
        const foundProject = projectsList.find(
          (p) =>
            p.id === actualId ||
            p.project_id === actualId ||
            p.id === `PRJ-${actualId}` ||
            p.project_id === `PRJ-${actualId}`
        );

        if (!foundProject) {
          setError('Project not found');
          setLoading(false);
          return;
        }

        // Enhanced project with admin data - Fix: Add proper null checks and defaults
        const enhancedProject = {
          ...foundProject,
          // Map agency strings to actual agency objects for more detailed display
          projectAgencies: Array.isArray(foundProject.fundingSources) 
            ? foundProject.fundingSources.map((fs) => {
                return (
                  agencies.find((a) => a.name === fs) || {
                    name: fs,
                    type: 'Unknown',
                    category: 'Unknown',
                  }
                );
              }) 
            : [],
          // Map funding sources to actual funding source objects
          projectFundingSources: Array.isArray(foundProject.fundingSources)
            ? foundProject.fundingSources.map((fs) => {
                return (
                  fundingSources.find((f) => f.name === fs) || {
                    name: fs,
                    dev_partner: 'Unknown',
                  }
                );
              })
            : [],
          // Convert location strings to location objects
          projectLocations: foundProject.location
            ? foundProject.location.split(', ').map((loc) => {
                return (
                  locations.find((l) => l.name === loc) || {
                    name: loc,
                    region: 'Unknown',
                  }
                );
              })
            : [],
          // For focal areas, we'll use sector as a proxy since that's what we have
          projectFocalAreas: foundProject.sector ? [{ name: foundProject.sector }] : [],
          // Ensure required fields have defaults
          beneficiaries: foundProject.beneficiaries || 0,
          progress: foundProject.progress || 0,
          disbursed: foundProject.disbursed || 0,
          status: foundProject.status || 'Unknown',
          implementingAgency: foundProject.implementingAgency || 'Not specified'
        };

        setProject(enhancedProject);
      } catch (err) {
        setError('Error loading project data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (actualId) {
      fetchProject();
    } else {
      setError('No project ID provided');
      setLoading(false);
    }
  }, [actualId]); // Update dependency

  // If no project found and no id (accessing without param), show not found
  if (error || (!actualId && !project)) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <Card padding={true}>
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <FolderOpen size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error || 'Project not found'}
            </h3>
            <p className="text-gray-500 mb-4">
              The project you're looking for doesn't exist or couldn't be loaded.
            </p>
            <Button onClick={() => navigate('/projects')} variant="outline">
              Back to Projects
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  if (loading || !project) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="max-w-2xl mx-auto py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Loading project...</h2>
        </div>
      </PageLayout>
    );
  }

  // Helper functions to handle data mapping between mock and real data
  const getTimeline = (proj) => {
    return proj.timeline || `${proj.startDate || 'N/A'} - ${proj.endDate || 'N/A'}`;
  };

  const getLocation = (proj) => {
    return proj.locations || proj.location || 'Not specified';
  };

  const getTotalBudget = (proj) => {
    return proj.totalFunding || proj.totalBudget || proj.total_cost_usd || 0;
  };

  const getManagementData = (proj) => {
    // If project has management data, use it; otherwise create from milestones
    if (proj.management && Array.isArray(proj.management)) {
      return proj.management;
    }

    // Create management data from milestones or default structure
    const totalBudget = getTotalBudget(proj);
    const disbursedAmount = proj.disbursed || (totalBudget * ((proj.progress || 0) / 100));

    return [
      {
        name: 'Infrastructure Development',
        total: totalBudget * 0.4,
        disbursed: disbursedAmount * 0.4,
      },
      {
        name: 'Community Programs',
        total: totalBudget * 0.3,
        disbursed: disbursedAmount * 0.3,
      },
      {
        name: 'Monitoring & Evaluation',
        total: totalBudget * 0.2,
        disbursed: disbursedAmount * 0.2,
      },
      {
        name: 'Project Management',
        total: totalBudget * 0.1,
        disbursed: disbursedAmount * 0.1,
      },
    ];
  };

  // Handle export functionality
  const handleExportReport = () => {
    const reportData = {
      projectId: project.id || project.project_id,
      title: project.title,
      status: project.status,
      description: project.description,
      totalBudget: getTotalBudget(project),
      disbursed: project.disbursed,
      progress: project.progress,
      location: getLocation(project),
      implementingAgency: project.implementingAgency,
      timeline: getTimeline(project),
      beneficiaries: project.beneficiaries,
      sdg: project.sdg,
      exportDate: new Date().toISOString().split('T')[0],
    };

    // Create downloadable JSON file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.id || project.project_id}_report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Status badge color
  const statusColor =
    project.status === 'Active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <Play size={12} />;
      case 'Completed':
        return <CheckCircle size={12} />;
      case 'Planning':
        return <Clock size={12} />;
      case 'On Hold':
        return <Pause size={12} />;
      default:
        return null;
    }
  };

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Back button with proper container alignment */}
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

      {/* Main Info Card - Remove layout-container class for proper alignment */}
      <Card className="mb-6 overflow-visible" padding={true}>
        <div>
          {/* Project ID and Status - Top Row */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${statusColor}`}
            >
              {getStatusIcon(project.status)}
              {project.status}
            </span>
            <span className="text-xs text-gray-400">{project.id || project.project_id}</span>
          </div>

          <div className="flex flex-col md:flex-row md:gap-8">
            {/* Left Side: Title, Description and Progress */}
            <div className="w-full md:w-3/5">
              {/* Title and Description */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {project.title || 'Untitled Project'}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {project.description || project.objectives || 'No description available'}
              </p>

              {/* Progress Bar - Enhanced spacing to match funding source details */}
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-700 font-semibold">
                    Project Progress
                  </div>
                  <div className="text-sm text-purple-600 font-bold">
                    {project.progress || 0}% Complete
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Disbursed: {formatCurrency(project.disbursed || 0)} of{' '}
                  {formatCurrency(project.progressBarMax || getTotalBudget(project))}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Right Side: Project Details */}
            <div className="w-full md:w-2/5 mt-6 md:mt-0">
              {/* Export Button - Moved to top right */}
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
                  <Building size={16} className="mt-0.5 text-purple-600" />
                  <div>
                    <span className="font-semibold">Implementing Agency</span>
                    <div className="text-xs text-gray-600">
                      {project.implementingAgency}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar size={16} className="mt-0.5 text-purple-600" />
                  <div>
                    <span className="font-semibold">Project Timeline</span>
                    <div className="text-xs text-gray-600">
                      {getTimeline(project)}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-purple-600" />
                  <div>
                    <span className="font-semibold">Locations</span>
                    <div className="text-xs text-gray-600">
                      {getLocation(project)}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Users size={16} className="mt-0.5 text-purple-600" />
                  <div>
                    <span className="font-semibold">Beneficiaries</span>
                    <div className="text-xs text-gray-600">
                      {(project.beneficiaries || 0).toLocaleString()} People
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <DollarSign size={16} className="mt-0.5 text-purple-600" />
                  <div>
                    <span className="font-semibold">Total Funding</span>
                    <div className="text-xs text-gray-600">
                      {formatCurrency(getTotalBudget(project))}
                    </div>
                  </div>
                </li>
                {project.sdg && (
                  <li className="flex items-start gap-2">
                    <Target size={16} className="mt-0.5 text-purple-600" />
                    <div>
                      <span className="font-semibold">SDG alignment</span>
                      <div className="text-xs text-gray-600">
                        {project.sdg}
                      </div>
                    </div>
                  </li>
                )}
                {project.wash_component?.presence && (
                  <li className="flex items-start gap-2">
                    <Droplet size={16} className="mt-0.5 text-purple-600" />
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

      {/* Project Overview Content - Remove tab conditional wrapper */}
      {/* Implementing & Executing Agencies */}
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
                  <Building size={18} className="text-purple-600" />
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

      {/* Funding Sources */}
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
                  <DollarSign size={18} className="text-purple-600" />
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

      {/* Project Locations */}
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
                  <MapPin size={18} className="text-purple-600" />
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

      {/* Focal Areas / Sectors */}
      <Card className="mb-6" padding={true}>
        <div>
          <div className="font-semibold mb-4">Focal Areas / Sectors</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.isArray(project.projectFocalAreas) && project.projectFocalAreas.length > 0 ? (
              project.projectFocalAreas.map((area, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3"
                >
                  <Tag size={18} className="text-purple-600" />
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

      {/* WASH Component (if present) */}
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

      {/* Project Management */}
      <Card className="mb-6" padding={true}>
        <div>
          <div className="font-semibold mb-4">Project Management</div>
          {getManagementData(project).map((item) => (
            <div key={item.name} className="mb-4">
              <div className="flex justify-between items-center text-sm">
                <span>{item.name}</span>
                <span className="font-bold">
                  {formatCurrency(item.total)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{
                    width: `${Math.round(
                      (item.disbursed / item.total) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>
                  {Math.round((item.disbursed / item.total) * 100)}%
                  disbursed
                </span>
                <span>
                  {formatCurrency(item.disbursed)} of{' '}
                  {formatCurrency(item.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageLayout>
  );
};

export default ProjectDetails;
