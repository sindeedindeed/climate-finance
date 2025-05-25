import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Building, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import BarChartComponent from '../components/charts/BarChartComponent';
import { formatCurrency } from '../utils/formatters';
import { CHART_COLORS } from '../utils/constants';

// Import mock data
import { projectsList } from '../data/mock/projectsData';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const project = projectsList.find(p => p.id === projectId);

  if (!project) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
          <Link to="/projects">
            <Button variant="primary">Back to Projects</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

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

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getMilestoneIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'In Progress': return <Clock size={16} className="text-blue-600" />;
      case 'Planned': return <Target size={16} className="text-gray-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  // Prepare budget breakdown data for chart
  const budgetData = [
    { category: 'Disbursed', amount: project.disbursed },
    { category: 'Remaining', amount: project.totalBudget - project.disbursed }
  ];

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link 
          to="/projects"
          className="flex items-center text-primary hover:text-primary-dark mr-4"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back to Projects
        </Link>
      </div>

      {/* Project Header */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h1>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                      {project.priority} Priority
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                      {project.sector}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium">{project.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium">{project.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign size={16} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Total Budget</p>
                    <p className="text-sm font-medium">{formatCurrency(project.totalBudget)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Beneficiaries</p>
                    <p className="text-sm font-medium">{project.beneficiaries.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Progress Overview */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Progress</h3>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Start Date</span>
                <span className="text-sm font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">End Date</span>
                <span className="text-sm font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium">{new Date(project.lastUpdated).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Risk Level</span>
                <span className={`text-sm font-medium ${getRiskColor(project.riskLevel)}`}>
                  {project.riskLevel}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Budget Breakdown */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Overview</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Disbursed</span>
                  <span>{Math.round((project.disbursed / project.totalBudget) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(project.disbursed / project.totalBudget) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Budget</span>
                  <span className="text-sm font-medium">{formatCurrency(project.totalBudget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Disbursed</span>
                  <span className="text-sm font-medium text-green-600">{formatCurrency(project.disbursed)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="text-sm font-medium text-orange-600">
                    {formatCurrency(project.totalBudget - project.disbursed)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Impact Metrics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(project.keyMetrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <p className="text-lg font-bold text-primary">{value.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Implementation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Project Timeline */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Milestones</h3>
            
            <div className="space-y-4">
              {project.milestones.map((milestone, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getMilestoneIcon(milestone.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-gray-800">{milestone.name}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(milestone.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{milestone.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Funding Sources & Implementation */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Implementation Details</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Funding Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {project.fundingSources.map((source, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {source}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Implementing Agency</h4>
                <div className="flex items-center">
                  <Building size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{project.implementingAgency}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Project ID</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{project.id}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Budget Visualization */}
      <Card className="mb-6">
        <BarChartComponent
          title="Budget Breakdown"
          data={budgetData}
          xAxisKey="category"
          bars={[
            { dataKey: 'amount', fill: CHART_COLORS[0], name: 'Amount' }
          ]}
          formatYAxis={true}
        />
      </Card>
    </PageLayout>
  );
};

export default ProjectDetails;
