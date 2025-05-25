import React, { useState } from 'react';
import { Search, Filter, Download, ExternalLink, Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import PieChartComponent from '../components/charts/PieChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import Button from '../components/ui/Button';
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
  
  // Filter projects based on search, sector, and status
  const filteredProjects = projectsList.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || project.sector === selectedSector;
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
    return matchesSearch && matchesSector && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Climate Finance Projects</h2>
          <p className="text-gray-500">Track and monitor climate finance project implementation across Bangladesh</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 md:mt-0">
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex items-center space-x-1"
          >
            <Filter size={16} />
            <span>Advanced Filters</span>
          </Button>
          
          <Button 
            variant="primary" 
            size="sm" 
            className="flex items-center space-x-1"
          >
            <Download size={16} />
            <span>Export Report</span>
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {projectsOverviewStats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={typeof stat.value === 'number' && stat.title.includes('Investment') ? formatCurrency(stat.value) : stat.value}
            change={stat.change}
          />
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Projects by Status */}
        <Card>
          <PieChartComponent
            title="Projects by Status"
            data={projectsByStatus}
            valueKey="value"
            nameKey="name"
          />
        </Card>
        
        {/* Projects by Sector */}
        <Card>
          <PieChartComponent
            title="Projects by Sector"
            data={projectsBySector}
            valueKey="value"
            nameKey="name"
          />
        </Card>
        
        {/* Projects Trend */}
        <Card>
          <LineChartComponent
            title="Project Growth Trend"
            data={projectsTrend}
            xAxisKey="year"
            yAxisKey="projects"
            lineName="Projects"
          />
        </Card>
      </div>
      
      {/* Projects List */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">All Projects</h3>
            
            <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-3">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Sector Filter */}
              <select
                className="block w-full lg:w-auto border border-gray-300 rounded-md text-sm py-2 px-3"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                <option value="All">All Sectors</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Water Resources">Water Resources</option>
                <option value="Forest Conservation">Forest Conservation</option>
                <option value="Disaster Risk">Disaster Risk</option>
              </select>
              
              {/* Status Filter */}
              <select
                className="block w-full lg:w-auto border border-gray-300 rounded-md text-sm py-2 px-3"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Planning">Planning</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Projects Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{project.title}</h4>
                    <p className="text-sm text-gray-600">{project.id}</p>
                  </div>
                  <div className="flex flex-col space-y-1 ml-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                
                {/* Key Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-2 text-gray-400" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign size={14} className="mr-2 text-gray-400" />
                    <span>{formatCurrency(project.totalBudget)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users size={14} className="mr-2 text-gray-400" />
                    <span>{project.beneficiaries.toLocaleString()} beneficiaries</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Sector Badge */}
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {project.sector}
                  </span>
                  
                  <Link 
                    to={`/projects/${project.id}`}
                    className="text-primary text-sm flex items-center hover:text-primary-dark transition-colors"
                  >
                    View Details
                    <ExternalLink size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects match your search criteria.</p>
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  );
};

export default Projects;
