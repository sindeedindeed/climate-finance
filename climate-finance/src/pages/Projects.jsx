import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import PieChartComponent from '../components/charts/PieChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import PageLayout from '../components/layouts/PageLayout';
import PageHeader from '../components/layouts/PageHeader';
import SearchFilter from '../components/ui/SearchFilter';
import Loading from '../components/ui/Loading';
import {
  FolderOpen,
  Activity,
  DollarSign,
  CheckCircle,
  Play,
  Clock,
  Pause,
  Download,
  Eye,
  Calendar,
  MapPin,
  Users,
  Building,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  const [projectsList, setProjectsList] = useState([]);
  const [overviewStats, setOverviewStats] = useState([]);
  const [projectsByStatus, setProjectsByStatus] = useState([]);
  const [projectsByType, setProjectsByType] = useState([]);
  const [projectTrend, setProjectTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetchAllProjectData();
  }, []);

  const fetchAllProjectData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        projectsResponse,
        overviewResponse,
        statusResponse,
        typeResponse,
        trendResponse
      ] = await Promise.all([
        projectApi.getAll(),
        projectApi.getOverviewStats(),
        projectApi.getByStatus(),
        projectApi.getByType(),
        projectApi.getTrend()
      ]);

      // Process projects data
      if (projectsResponse?.status && Array.isArray(projectsResponse.data)) {
        setProjectsList(projectsResponse.data);
      } else {
        setProjectsList([]);
        console.warn('No projects data received from API');
      }

      // Process overview stats
      if (overviewResponse?.status && overviewResponse.data) {
        const data = overviewResponse.data;
        setOverviewStats([
          { title: "Total Projects", value: data.total_projects || 0, change: "+12% from last year" },
          { title: "Active Projects", value: data.active_projects || 0, change: "+8% from last month" },
          { title: "Total Investment", value: data.total_investment || 0, change: "+15% from last year" },
          { title: "Completed Projects", value: data.completed_projects || 0, change: "+23% from last year" }
        ]);
      } else {
        setOverviewStats([]);
      }

      // Process status data
      if (statusResponse?.status && Array.isArray(statusResponse.data)) {
        setProjectsByStatus(statusResponse.data);
      } else {
        setProjectsByStatus([]);
        console.warn('No status data received from API');
      }

      // Process type data
      if (typeResponse?.status && Array.isArray(typeResponse.data)) {
        setProjectsByType(typeResponse.data);
      } else {
        setProjectsByType([]);
        console.warn('No type data received from API');
      }

      // Process trend data
      if (trendResponse?.status && Array.isArray(trendResponse.data)) {
        setProjectTrend(trendResponse.data);
      } else {
        setProjectTrend([]);
        console.warn('No trend data received from API');
      }

      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching project data:', error);
      setError(error.message || 'Failed to load project data. Please try again.');
      setProjectsList([]);
      setOverviewStats([]);
      setProjectsByStatus([]);
      setProjectsByType([]);
      setProjectTrend([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchAllProjectData();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <Play size={12} />;
      case 'Completed': return <CheckCircle size={12} />;
      case 'Planning': return <Clock size={12} />;
      case 'On Hold': return <Pause size={12} />;
      default: return null;
    }
  };

  const sectors = ['All', ...new Set(projectsList.map(p => p.sector).filter(Boolean))];
  const statuses = ['All', ...new Set(projectsList.map(p => p.status).filter(Boolean))];

  const statsData = Array.isArray(overviewStats) ? overviewStats.map((stat, index) => {
    const colors = ['primary', 'success', 'warning', 'primary'];
    const icons = [<FolderOpen size={20} />, <Activity size={20} />, <DollarSign size={20} />, <CheckCircle size={20} />];
    
    return {
      ...stat,
      color: colors[index] || 'primary',
      icon: icons[index] || <FolderOpen size={20} />
    };
  }) : [];

  const filteredProjects = projectsList.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.project_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || project.sector === selectedSector;
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
    
    return matchesSearch && matchesSector && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Planning': return 'bg-yellow-100 text-yellow-700';
      case 'On Hold': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewDetails = (e, projectId) => {
    e.stopPropagation();
    navigate(`/projects/${projectId}`);
  };

  if (isLoading) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="flex flex-col justify-center items-center min-h-64">
          <Loading size="lg" />
          <p className="mt-4 text-gray-600">Loading project data...</p>
          {retryCount > 0 && (
            <p className="mt-2 text-sm text-gray-500">Retry attempt: {retryCount}</p>
          )}
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <Card padding={true}>
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <AlertCircle size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Project Data</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleRetry}
                leftIcon={<RefreshCw size={16} />}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Retry
              </Button>
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Go to Dashboard
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

  return (
    <PageLayout bgColor="bg-gray-50">
      <PageHeader
        title="Climate Projects"
        subtitle="Explore climate finance projects across Bangladesh"
        actions={
          <Button
            leftIcon={<Download size={16} />}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => {
              if (projectsList.length === 0) {
                console.log('No data available to export');
                return;
              }
              
              const exportData = {
                projects: filteredProjects,
                overview: overviewStats,
                chartData: {
                  status: projectsByStatus,
                  type: projectsByType,
                  trend: projectTrend
                },
                exportDate: new Date().toISOString()
              };
              
              const dataStr = JSON.stringify(exportData, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `climate_projects_${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
          >
            Export Data
          </Button>
        }
      />

      {/* Stats Section */}
      {statsData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div 
              key={index}
              className="animate-fade-in-up h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatCard 
                title={stat.title}
                value={typeof stat.value === 'number' && stat.title.includes('Investment') ? formatCurrency(stat.value) : stat.value}
                change={stat.change}
                color={stat.color}
                icon={stat.icon}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-8">
          <Card padding={true}>
            <div className="text-center py-6">
              <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Statistics unavailable</p>
            </div>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Card hover padding={true}>
            {projectsByStatus.length > 0 ? (
              <PieChartComponent
                title="Projects by Status"
                data={projectsByStatus}
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">No status data available</p>
                </div>
              </div>
            )}
          </Card>
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <Card hover padding={true}>
            {projectsByType.length > 0 ? (
              <PieChartComponent
                title="Projects by Type"
                data={projectsByType}
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">No type data available</p>
                </div>
              </div>
            )}
          </Card>
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <Card hover padding={true}>
            {projectTrend.length > 0 ? (
              <LineChartComponent
                title="Project Trends"
                data={projectTrend}
                xKey="year"
                yKey="count"
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">No trend data available</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Projects List */}
      <Card hover className="mb-6" padding={true}>
        <div className="border-b border-gray-100 pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">Climate Finance Projects</h3>
            
            <SearchFilter
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search projects..."
              filters={[
                {
                  value: selectedSector,
                  onChange: setSelectedSector,
                  options: sectors.map(sector => ({
                    value: sector,
                    label: sector === 'All' ? 'All Sectors' : sector
                  }))
                },
                {
                  value: selectedStatus,
                  onChange: setSelectedStatus,
                  options: statuses.map(status => ({
                    value: status,
                    label: status === 'All' ? 'All Status' : status
                  }))
                }
              ]}
              className="mt-4 md:mt-0"
            />
          </div>

          <div className="text-sm text-gray-500 mt-2">
            Showing {filteredProjects.length} of {projectsList.length} projects
          </div>
        </div>

        {projectsList.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects available</h3>
            <p className="text-gray-500 mb-4">
              There are currently no projects in the system.
            </p>
            <Button
              onClick={handleRetry}
              leftIcon={<RefreshCw size={16} />}
              variant="outline"
            >
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.project_id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(index % 9) * 100}ms` }}
              >
                <Card 
                  hover 
                  padding={true} 
                  className="h-full group relative"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {project.objectives || 'No description available'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1">{project.status}</span>
                      </span>
                      {project.type && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          {project.type}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 mb-4 flex-grow">
                      {project.total_cost_usd && (
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign size={16} className="mr-2 text-green-500" />
                          <span className="font-medium">Budget:</span>
                          <span className="ml-1 text-green-600 font-semibold">
                            {formatCurrency(project.total_cost_usd)}
                          </span>
                        </div>
                      )}

                      {(project.beginning || project.closing) && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={16} className="mr-2 text-blue-500" />
                          <span className="font-medium">Duration:</span>
                          <span className="ml-1">
                            {formatDate(project.beginning)} - {formatDate(project.closing)}
                          </span>
                        </div>
                      )}

                      {project.beneficiaries && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={16} className="mr-2 text-purple-500" />
                          <span className="font-medium">Beneficiaries:</span>
                          <span className="ml-1">{project.beneficiaries}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Building size={16} className="mr-1" />
                        <span>ID: {project.project_id}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Eye size={14} />}
                        onClick={(e) => handleViewDetails(e, project.project_id)}
                        className="text-purple-600 border-purple-600 hover:bg-purple-50"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && projectsList.length > 0 && (
          <div className="text-center py-12">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedSector('All');
                setSelectedStatus('All');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Card>
    </PageLayout>
  );
};

export default Projects;
