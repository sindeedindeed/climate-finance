import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
} from 'lucide-react';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { projectsList } from '../data/mock/projectsData';

// --- MOCK DATA (replace with real data as needed) ---
const mockProject = {
  id: 'PRJ-2025-042',
  status: 'Active',
  title: 'Coastal Climate Resilience Program',
  description:
    'A comprehensive program to enhance climate resilience in coastal communities through infrastructure development, ecosystem restoration, and capacity building.',
  implementingAgency: 'Bangladesh Water Development Board',
  timeline: 'July 1, 2024 - June 30, 2025',
  locations: 'Chittagong, Cox’s Bazar, Patuakhali',
  beneficiaries: 125000,
  totalFunding: 12500000,
  sdg: 'SDGs 11, 13, 14',
  progress: 30,
  disbursed: 3700000,
  progressBarMax: 12500000,
  management: [
    {
      name: 'Sea Embankment Construction',
      total: 5500000,
      disbursed: 3200000,
    },
    {
      name: 'Mangrove Restoration',
      total: 5500000,
      disbursed: 3200000,
    },
    {
      name: 'Early Warning Systems',
      total: 5500000,
      disbursed: 3200000,
    },
    {
      name: 'Community Training',
      total: 5500000,
      disbursed: 3200000,
    },
    {
      name: 'Project Management',
      total: 5500000,
      disbursed: 3200000,
    },
  ],
  partners: [
    'Ministry of Environment',
    'UNDF',
    'Local NGOs',
  ],
};

const TABS = ['Overview', 'Finances', 'Milestones', 'Indicators'];

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Find project from the projects list or use mock project as fallback
  const project = projectsList.find(p => p.id === projectId) || mockProject;

  // If no project found and no projectId (accessing without param), show not found
  if (!projectId && !project) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="max-w-2xl mx-auto py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="mb-4 text-gray-500">The project you are looking for does not exist.</p>
          <Link to="/projects" className="text-primary underline">Back to Projects</Link>
        </div>
      </PageLayout>
    );
  }

  // Helper functions to handle data mapping between mock and real data
  const getTimeline = (proj) => {
    return proj.timeline || `${proj.startDate} - ${proj.endDate}`;
  };

  const getLocation = (proj) => {
    return proj.locations || proj.location;
  };

  const getTotalBudget = (proj) => {
    return proj.totalFunding || proj.totalBudget;
  };

  const getManagementData = (proj) => {
    // If project has management data, use it; otherwise create from milestones
    if (proj.management) {
      return proj.management;
    }
    
    // Create management data from milestones or default structure
    const totalBudget = getTotalBudget(proj);
    const disbursedAmount = proj.disbursed || (totalBudget * (proj.progress / 100));
    
    return [
      { name: 'Infrastructure Development', total: totalBudget * 0.4, disbursed: disbursedAmount * 0.4 },
      { name: 'Community Programs', total: totalBudget * 0.3, disbursed: disbursedAmount * 0.3 },
      { name: 'Monitoring & Evaluation', total: totalBudget * 0.2, disbursed: disbursedAmount * 0.2 },
      { name: 'Project Management', total: totalBudget * 0.1, disbursed: disbursedAmount * 0.1 }
    ];
  };

  const getPartners = (proj) => {
    return proj.partners || proj.fundingSources || ['Government Agency', 'International Partner'];
  };

  // Handle export functionality
  const handleExportReport = () => {
    const reportData = {
      projectId: project.id,
      title: project.title,
      status: project.status,
      description: project.description,
      totalBudget: project.totalFunding || project.totalBudget,
      disbursed: project.disbursed,
      progress: project.progress,
      location: project.locations || project.location,
      implementingAgency: project.implementingAgency,
      timeline: project.timeline || `${project.startDate} - ${project.endDate}`,
      beneficiaries: project.beneficiaries,
      sdg: project.sdg,
      exportDate: new Date().toISOString().split('T')[0]
    };

    // Create downloadable JSON file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.id}_report.json`;
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

  return (
    <PageLayout bgColor="bg-gray-50">
      <div className="mb-4 flex items-center">
        <Link to="/projects" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>
      </div>
      <div className="max-w-5xl mx-auto">
        {/* Main Info Card - Redesigned Layout */}
        <Card className="mb-6 p-0 overflow-visible">
          <div className="p-6">
            {/* Project ID and Status - Top Row */}
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor}`}>Active</span>
              <span className="text-xs text-gray-400">{project.id}</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:gap-8">
              {/* Left Side: Title, Description and Progress */}
              <div className="w-full md:w-3/5">
                {/* Title and Description */}
                <h2 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h2>
                <p className="text-xs text-gray-500 mb-4">
                  {project.description}
                </p>
                
                {/* Progress Bar - Now below title/description */}
                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <div className="text-xs text-gray-700 font-semibold mb-1">Project Progress</div>
                  <div className="text-xs text-gray-500 mb-1">
                    Disbursed: {formatCurrency(project.disbursed)} of {formatCurrency(project.progressBarMax || getTotalBudget(project))}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div
                      className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">{project.progress}% Complete</div>
                </div>
                
                {/* Export Button */}
                <div className="flex gap-3 mb-2">
                  <Button 
                    variant="primary" 
                    size="md" 
                    className="w-40 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
                    onClick={handleExportReport}
                    leftIcon={<Download size={16} />}
                  >
                    Export Report
                  </Button>
                </div>
              </div>
              
              {/* Right Side: Project Details */}
              <div className="w-full md:w-2/5 mt-6 md:mt-0">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Building size={16} className="mt-0.5 text-purple-600" />
                    <div>
                      <span className="font-semibold">Implementing Agency</span>
                      <div className="text-xs text-gray-600">{project.implementingAgency}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Calendar size={16} className="mt-0.5 text-purple-600" />
                    <div>
                      <span className="font-semibold">Project Timeline</span>
                      <div className="text-xs text-gray-600">{getTimeline(project)}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 text-purple-600" />
                    <div>
                      <span className="font-semibold">Locations</span>
                      <div className="text-xs text-gray-600">{getLocation(project)}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users size={16} className="mt-0.5 text-purple-600" />
                    <div>
                      <span className="font-semibold">Beneficiaries</span>
                      <div className="text-xs text-gray-600">{project.beneficiaries.toLocaleString()} People</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign size={16} className="mt-0.5 text-purple-600" />
                    <div>
                      <span className="font-semibold">Total Funding</span>
                      <div className="text-xs text-gray-600">{formatCurrency(getTotalBudget(project))}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock size={16} className="mt-0.5 text-purple-600" />
                    <div>
                      <span className="font-semibold">SDG alignment</span>
                      <div className="text-xs text-gray-600">{project.sdg}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-2 flex gap-6 text-sm">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-1 border-b-2 font-medium transition-all duration-200 hover:scale-105 ${
                activeTab === tab
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-purple-600'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content: Overview (only) */}
        {activeTab === 'Overview' && (
          <>
            <Card className="mb-6">
              <div className="p-4">
                <div className="font-semibold mb-4">Project Management</div>
                {getManagementData(project).map((item) => (
                  <div key={item.name} className="mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>{item.name}</span>
                      <span className="font-bold">{formatCurrency(item.total)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${Math.round((item.disbursed / item.total) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{Math.round((item.disbursed / item.total) * 100)}% disbursed</span>
                      <span>{formatCurrency(item.disbursed)} of {formatCurrency(item.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <div className="font-semibold mb-2">Implementing Partners</div>
                <ul className="divide-y divide-gray-200">
                  {getPartners(project).map((partner) => (
                    <li key={partner} className="flex items-center gap-2 py-3 hover:bg-purple-50 transition-colors rounded-lg px-2 -mx-2">
                      <Building size={18} className="text-purple-600" />
                      <span className="text-sm">{partner}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </>
        )}
        {/* Other tabs can be implemented similarly */}
      </div>
    </PageLayout>
  );
};

export default ProjectDetails;
