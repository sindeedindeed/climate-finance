import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectApi, agencyApi, fundingSourceApi } from '../services/api';
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
import ExportButton from '../components/ui/ExportButton';
import {
  FolderOpen,
  Activity,
  DollarSign,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import MultiSelect from '../components/ui/MultiSelect';
import { useLanguage } from '../context/LanguageContext';
import { translateChartData, getChartTitle } from '../utils/chartTranslations';



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
  const [activeFilters, setActiveFilters] = useState({
    sector: 'All',
    status: 'All',
    type: 'All',
    division: 'All',
    approval_fy: 'All',
    agency_id: 'All',
    funding_source_id: 'All'
  });

  // Add filtered projects state
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [agencies, setAgencies] = useState([]);
  const [fundingSources, setFundingSources] = useState([]);

  const { language } = useLanguage();

  useEffect(() => {
    fetchAllProjectData();
  }, []);

  useEffect(() => {
    // Fetch agencies and funding sources
    agencyApi.getAll().then(res => {
      if (res?.status && Array.isArray(res.data)) setAgencies(res.data);
      else setAgencies([]);
    });
    fundingSourceApi.getAll().then(res => {
      if (res?.status && Array.isArray(res.data)) setFundingSources(res.data);
      else setFundingSources([]);
    });
  }, []);

  const fetchAllProjectData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('[Projects] Fetching projects data');
      const [
        projectsResponse,
        overviewResponse,
        statusResponse,
        typeResponse,
        trendResponse
      ] = await Promise.all([
        projectApi.getAll(),
        projectApi.getProjectsOverviewStats(),
        projectApi.getByStatus(),
        projectApi.getByType(),
        projectApi.getTrend()
      ]);
      console.log('[Projects] API responses:', {
        projectsResponse,
        overviewResponse,
        statusResponse,
        typeResponse,
        trendResponse
      });
      if (projectsResponse?.status && Array.isArray(projectsResponse.data)) {
        setProjectsList(projectsResponse.data);
        setFilteredProjects(projectsResponse.data);
      } else {
        setProjectsList([]);
        setFilteredProjects([]);
        console.warn('No projects data received from API', projectsResponse);
      }

      if (overviewResponse?.status && overviewResponse.data) {
        const data = overviewResponse.data;
        const currentYear = data.current_year || {};
        const calculateChange = (total, current) => {
          const previous = total - current;
          if (!total || !current || previous <= 0 || current === 0) return "No comparison available";
          const percentage = ((current / previous) - 1) * 100;
          return percentage >= 0 ? `+${percentage.toFixed(2)}% from last year` : `${percentage.toFixed(2)}% from last year`;
        };

        setOverviewStats([
          {
            title: "Total Projects",
            value: data.total_projects || 0,
            change: calculateChange(data.total_projects, currentYear.total_projects)
          },
          {
            title: "Active Projects",
            value: data.active_projects || 0,
            change: calculateChange(data.active_projects, currentYear.active_projects)
          },
          {
            title: "Total Investment",
            value: formatCurrency(data.total_investment || 0),
            change: calculateChange(data.total_investment, currentYear.total_investment)
          },
          {
            title: "Completed Projects",
            value: data.completed_projects || 0,
            change: currentYear.completed_projects ? 
              calculateChange(data.completed_projects, currentYear.completed_projects) : 
              "Based on all-time data"
          }
        ]);
      } else {
        setOverviewStats([]);
      }

      if (statusResponse?.status && Array.isArray(statusResponse.data)) {
        setProjectsByStatus(statusResponse.data);
      } else {
        setProjectsByStatus([]);
        console.warn('No status data received from API');
      }

      if (typeResponse?.status && Array.isArray(typeResponse.data)) {
        setProjectsByType(typeResponse.data);
      } else {
        setProjectsByType([]);
        console.warn('No type data received from API');
      }

      if (trendResponse?.status && Array.isArray(trendResponse.data)) {
        setProjectTrend(trendResponse.data);
      } else {
        setProjectTrend([]);
        console.warn('No trend data received from API');
      }

      setRetryCount(0);
    } catch (error) {
      console.error('[Projects] Error fetching project data:', error);
      setError(error.message || 'Failed to load project data. Please try again.');
      setProjectsList([]);
      setFilteredProjects([]);
      setOverviewStats([]);
      setProjectsByStatus([]);
      setProjectsByType([]);
      setProjectTrend([]);
    } finally {
      setIsLoading(false);
    }
  };

  const statsData = Array.isArray(overviewStats) ? overviewStats.map((stat, index) => {
    const colors = ['primary', 'success', 'warning', 'primary'];
    const icons = [<FolderOpen size={20} />, <Activity size={20} />, <DollarSign size={20} />, <CheckCircle size={20} />];
    return {
      ...stat,
      color: colors[index] || 'primary',
      icon: icons[index] || <FolderOpen size={20} />
    };
  }) : [];

  // Set default filtered projects when projectsList changes
  useEffect(() => {
    if (projectsList.length > 0) {
      setFilteredProjects(projectsList);
    }
  }, [projectsList]);

  const getProjectsConfig = useMemo(() => {
    if (!projectsList || projectsList.length === 0) {
      return {
        searchFields: [
          { key: 'title', label: 'Project Title', weight: 3 },
          { key: 'project_id', label: 'Project ID', weight: 3 },
          { key: 'objectives', label: 'Objectives', weight: 2 },
          { key: 'beneficiaries', label: 'Beneficiaries', weight: 1 }
        ],
        filters: []
      };
    }

    // Create unique option arrays using the actual fields available
    const sectors = Array.from(new Set(projectsList.map(p => p.sector).filter(Boolean))).sort();
    const types = Array.from(new Set(projectsList.map(p => p.type).filter(Boolean))).sort();
    const divisions = Array.from(new Set(projectsList.map(p => p.division).filter(Boolean))).sort();
    const statuses = Array.from(new Set(projectsList.map(p => p.status).filter(Boolean))).sort();
    const approvalYears = Array.from(new Set(projectsList.map(p => p.approval_fy).filter(Boolean))).sort();

    const filters = [
      {
        key: 'status',
        label: 'Status',
        options: [
          { value: 'All', label: 'All Statuses' },
          ...statuses.map(status => ({ value: status, label: status }))
        ]
      },
      ...(sectors.length > 0 ? [{
        key: 'sector',
        label: 'Sector',
        options: [
          { value: 'All', label: 'All Sectors' },
          ...sectors.map(sector => ({ value: sector, label: sector }))
        ]
      }] : []),
      ...(types.length > 0 ? [{
        key: 'type',
        label: 'Project Type',
        options: [
          { value: 'All', label: 'All Types' },
          ...types.map(type => ({ value: type, label: type }))
        ]
      }] : []),
      ...(divisions.length > 0 ? [{
        key: 'division',
        label: 'Division',
        options: [
          { value: 'All', label: 'All Divisions' },
          ...divisions.map(division => ({ value: division, label: division }))
        ]
      }] : []),
      ...(approvalYears.length > 0 ? [{
        key: 'approval_fy',
        label: 'Approval Year',
        options: [
          { value: 'All', label: 'All Approval Years' },
          ...approvalYears.map(year => ({ value: year, label: year }))
        ]
      }] : []),
      {
        key: 'agency_id',
        label: 'Agency',
        options: [
          { value: 'All', label: 'All Agencies' },
          ...agencies.map(a => ({ value: a.agency_id, label: a.name }))
        ]
      },
      {
        key: 'funding_source_id',
        label: 'Funding Source',
        options: [
          { value: 'All', label: 'All Funding Sources' },
          ...fundingSources.map(f => ({ value: f.funding_source_id, label: f.name }))
        ]
      },
    ];

    return {
      searchFields: [
        { key: 'title', label: 'Project Title', weight: 3 },
        { key: 'project_id', label: 'Project ID', weight: 3 },
        { key: 'objectives', label: 'Objectives', weight: 2 },
        { key: 'beneficiaries', label: 'Beneficiaries', weight: 1 }
      ],
      filters: filters
    };
  }, [projectsList, agencies, fundingSources]);

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

  const getExportData = () => {
    if (filteredProjects.length === 0) {
      return null;
    }
    
    return {
      projects: filteredProjects,
      overview: overviewStats,
      chartData: {
        status: projectsByStatus,
        type: projectsByType,
        trend: projectTrend
      },
      filters: {
        searchTerm,
        activeFilters
      },
      summary: {
        totalProjects: filteredProjects.length,
        totalBudget: filteredProjects.reduce((sum, p) => sum + (p.total_cost_usd || 0), 0)
      }
    };
  };

  // Translate category labels for status and type
  const translatedProjectsByStatus = translateChartData(projectsByStatus, language, 'status');
  const translatedProjectsByType = translateChartData(projectsByType, language, 'type');

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
                onClick={() => fetchAllProjectData()}
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
          <ExportButton
            data={getExportData()}
            filename="climate_projects"
            title="Climate Finance Projects"
            subtitle="Comprehensive list of climate projects in Bangladesh"
            variant="export"
            exportFormats={['pdf', 'json', 'csv']}
            className="w-full sm:w-auto"
          />
        }
      />

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Card hover padding={true}>
            {projectsByStatus.length > 0 ? (
              <PieChartComponent
                title={getChartTitle(language, 'projectsByStatus')}
                data={translatedProjectsByStatus}
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
                title={getChartTitle(language, 'projectsByType')}
                data={translatedProjectsByType}
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
                xAxisKey="year"
                yAxisKey="projects"
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

      <Card hover className="mb-6" padding={true}>
        <div className="border-b border-gray-100 pb-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Climate Finance Projects</h3>
          
          <SearchFilter
            data={projectsList}
            onFilteredData={setFilteredProjects}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search projects by title, ID, objectives..."
            entityType="projects"
            customConfig={getProjectsConfig}
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
            showAdvancedSearch={true}
            onClearAll={() => {
              setSearchTerm('');
              setActiveFilters({
                sector: 'All',
                status: 'All',
                type: 'All',
                division: 'All',
                approval_fy: 'All',
                agency_id: 'All',
                funding_source_id: 'All'
              });
            }}
          />
        </div>

        {projectsList.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects available</h3>
            <p className="text-gray-500 mb-4">
              There are currently no projects in the system.
            </p>
            <Button
              onClick={() => fetchAllProjectData()}
              leftIcon={<RefreshCw size={16} />}
              variant="outline"
            >
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.project_id || `project-${index}`}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(index % 9) * 100}ms` }}
              >
                <div 
                  className="group bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col"
                  onClick={(e) => handleViewDetails(e, project.project_id)}
                >
                  <div className="p-4 sm:p-6 flex flex-col h-full min-h-[320px]">
                    <div className="mb-4 min-h-[100px] flex flex-col justify-start">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2 text-base sm:text-lg leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-3 flex-1">
                        {project.objectives || project.description || 'No description available'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4 min-h-[32px] items-start">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      {project.type && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          {project.type}
                        </span>
                      )}
                      {project.sector && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {project.sector}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 mb-4 flex-1">
                      {project.total_cost_usd && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 font-medium">Total Budget:</span>
                          <span className="text-green-600 font-semibold text-xs sm:text-sm">
                            {formatCurrency(project.total_cost_usd)}
                          </span>
                        </div>
                      )}

                      {project.gef_grant && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 font-medium">GEF Grant:</span>
                          <span className="text-blue-600 font-semibold text-xs sm:text-sm">
                            {formatCurrency(project.gef_grant)}
                          </span>
                        </div>
                      )}

                      {(project.beginning && project.closing) && (
                        <div className="text-sm">
                          <span className="text-gray-600 font-medium">Duration:</span>
                          <div className="text-gray-700 mt-1 text-xs">
                            {formatDate(project.beginning)} - {formatDate(project.closing)}
                          </div>
                        </div>
                      )}

                      {project.agencies && project.agencies.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-600 font-medium">Agency:</span>
                          <div className="text-gray-700 mt-1 line-clamp-2 text-xs">
                            {project.agencies.map(agency => agency.name).join(', ')}
                          </div>
                        </div>
                      )}

                      {project.funding_sources && project.funding_sources.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-600 font-medium">Funding Source:</span>
                          <div className="text-gray-700 mt-1 line-clamp-2 text-xs">
                            {project.funding_sources.map(fs => fs.name).join(', ')}
                          </div>
                        </div>
                      )}

                      {project.beneficiaries && (
                        <div className="text-sm">
                          <span className="text-gray-600 font-medium">Beneficiaries:</span>
                          <div className="text-gray-700 mt-1 line-clamp-2 text-xs">
                            {project.beneficiaries}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 truncate mr-2">
                          ID: {project.project_id}
                        </div>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleViewDetails(e, project.project_id)}
                          className="text-purple-600 border-purple-600 hover:bg-purple-50 flex-shrink-0 text-xs px-2 py-1"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
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
                setActiveFilters({
                  sector: 'All',
                  status: 'All',
                  type: 'All',
                  division: 'All',
                  approval_fy: 'All',
                  agency_id: 'All',
                  funding_source_id: 'All'
                });
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
    </PageLayout>
  );
};

export default Projects;
