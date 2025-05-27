import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, ExternalLink, Calendar, MapPin, DollarSign, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import PieChartComponent from '../components/charts/PieChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import { useToast } from '../components/ui/Toast';
import { formatCurrency } from '../utils/formatters';

// Import mock data
import { 
  projectsList, 
  projectsOverviewStats, 
  projectsByStatus, 
  projectsBySector, 
  projectsTrend 
} from '../data/mock/projectsData';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  // Memoized filtered projects
  const filteredProjects = useMemo(() => {
    return projectsList.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'All' || project.sector === selectedSector;
      const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
      return matchesSearch && matchesSector && matchesStatus;
    });
  }, [searchTerm, selectedSector, selectedStatus]);
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSector('All');
    setSelectedStatus('All');
    toast.info('All filters cleared');
  };

  // Export filtered data
  const handleExport = () => {
    const exportData = {
      totalProjects: filteredProjects.length,
      projects: filteredProjects.map(p => ({
        id: p.id,
        title: p.title,
        sector: p.sector,
        status: p.status,
        budget: p.totalBudget,
        progress: p.progress
      })),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `projects_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Projects data exported successfully');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-success-100 text-success-800';
      case 'Completed': return 'bg-primary-100 text-primary-800';
      case 'Planning': return 'bg-warning-100 text-warning-800';
      case 'On Hold': return 'bg-error-100 text-error-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-error-100 text-error-800';
      case 'Medium': return 'bg-warning-100 text-warning-800';
      case 'Low': return 'bg-success-100 text-success-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  // Get unique values for filter options
  const sectors = ['All', ...new Set(projectsList.map(p => p.sector))];
  const statuses = ['All', ...new Set(projectsList.map(p => p.status))];

  if (loading) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <Loading type="skeleton" text="Loading projects..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Climate Finance Projects
          </h1>
          <p className="text-gray-600 text-lg">
            Track and monitor climate finance project implementation across Bangladesh
          </p>
        </div>
          <div className="flex flex-col sm:flex-row gap-3">          <Button 
            variant="primary" 
            leftIcon={<Download size={16} />}
            onClick={handleExport}
            className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
          >
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {projectsOverviewStats.map((stat, index) => (
          <div 
            key={index}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatCard 
              title={stat.title}
              value={typeof stat.value === 'number' && stat.title.includes('Investment') ? formatCurrency(stat.value) : stat.value}
              change={stat.change}
              color={index % 2 === 0 ? 'primary' : 'success'}
            />
          </div>
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Card hover>
            <PieChartComponent
              title="Projects by Status"
              data={projectsByStatus}
              valueKey="value"
              nameKey="name"
            />
          </Card>
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <Card hover>
            <PieChartComponent
              title="Projects by Sector"
              data={projectsBySector}
              valueKey="value"
              nameKey="name"
            />
          </Card>
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <Card hover>
            <LineChartComponent
              title="Project Growth Trend"
              data={projectsTrend}
              xAxisKey="year"
              yAxisKey="projects"
              lineName="Projects"
            />
          </Card>
        </div>
      </div>
      
      {/* Projects List */}
      <Card className="mb-6 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                All Projects ({filteredProjects.length})
              </h3>
                {/* Active filters indicator */}
              {(searchTerm || selectedSector !== 'All' || selectedStatus !== 'All') && (
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <span className="text-sm text-gray-500">Filters active:</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<X size={12} />}
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                </div>
              )}
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
              
              {/* Simplified filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  className="border border-gray-300 rounded-xl text-sm py-2.5 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>
                      {sector === 'All' ? 'All Sectors' : sector}
                    </option>
                  ))}
                </select>
                
                <select
                  className="border border-gray-300 rounded-xl text-sm py-2.5 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'All' ? 'All Status' : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Projects Grid */}
        <div className="p-6">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (                <div 
                  key={project.id} 
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-2 hover:border-purple-200 transition-all duration-300 animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-sm text-gray-500 font-mono">{project.id}</p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                    {/* Key Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2 text-purple-500 group-hover:text-purple-600 transition-colors" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-2 text-purple-500 group-hover:text-purple-600 transition-colors" />
                      <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign size={14} className="mr-2 text-purple-500 group-hover:text-purple-600 transition-colors" />
                      <span>{formatCurrency(project.totalBudget)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={14} className="mr-2 text-purple-500 group-hover:text-purple-600 transition-colors" />
                      <span>{project.beneficiaries.toLocaleString()} beneficiaries</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {project.sector}
                    </span>
                      <Link 
                      to={`/projects/${project.id}`}
                      className="text-purple-600 text-sm font-medium flex items-center gap-1 hover:text-purple-700 transition-colors group-hover:gap-2"
                    >
                      View Details
                      <ExternalLink size={14} className="transition-transform group-hover:scale-110" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500 mb-4">
                No projects match your search criteria. Try adjusting your filters.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  );
};

export default Projects;
