import React, { useState, useEffect } from 'react';
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
  Globe,
  Banknote,
  Play,
  Pause,
} from 'lucide-react';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { fundingSources } from '../data/mock/fundingSources';
import { generateOrganizationLogo } from '../utils/svgPlaceholder';

const TABS = ['Overview', 'Projects', 'Disbursements', 'Performance'];

const FundingSourceDetails = () => {
  const { sourceId } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the funding source by ID
    const foundSource = fundingSources.find(s => s.id.toString() === sourceId);
    setSource(foundSource);
    setLoading(false);
  }, [sourceId]);

  if (loading) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </PageLayout>
    );
  }

  if (!source) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Funding Source Not Found</h2>
          <p className="text-gray-600 mb-6">The funding source you're looking for doesn't exist.</p>
          <Link to="/funding-sources" className="text-purple-600 hover:text-purple-700">
            ← Back to Funding Sources
          </Link>
        </div>
      </PageLayout>
    );
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Multilateral': return <Globe size={16} />;
      case 'Bilateral': return <Users size={16} />;
      case 'Private': return <Building size={16} />;
      case 'Climate Fund': return <Banknote size={16} />;
      default: return <Building size={16} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Multilateral': return 'bg-blue-100 text-blue-800';
      case 'Bilateral': return 'bg-green-100 text-green-800';
      case 'Private': return 'bg-purple-100 text-purple-800';
      case 'Climate Fund': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const disbursementRate = (source.total_disbursed / source.total_committed) * 100;

  const handleExportReport = () => {
    const reportData = {
      source: source.name,
      type: source.type,
      totalCommitted: source.total_committed,
      totalDisbursed: source.total_disbursed,
      disbursementRate: disbursementRate,
      activeProjects: source.active_projects,
      sectors: source.sectors,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${source.name.replace(/\s+/g, '_')}_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <PageLayout bgColor="bg-gray-50">
      <div className="mb-4 flex items-center">
        <Link to="/funding-sources" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Funding Sources
        </Link>
      </div>
      
      <div className="layout-container">
        {/* Main Info Card */}
        <Card className="mb-6 overflow-visible" padding={true}>
          <div>
            {/* Source Type and Status - Top Row */}
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${getTypeColor(source.type)}`}>
                {getTypeIcon(source.type)}
                {source.type}
              </span>
              <span className="text-xs text-gray-400">ID: {source.id}</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:gap-8">
              {/* Left Side: Title, Description and Progress */}
              <div className="w-full md:w-3/5">
                {/* Title and Description */}
                <div className="flex items-start gap-4 mb-4 pt-2">
                  <img 
                    src={generateOrganizationLogo(source.name, source.type, 64)} 
                    alt={source.name} 
                    className="w-16 h-16 rounded-xl border border-gray-100 shadow-sm flex-shrink-0" 
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{source.name}</h2>
                    <p className="text-sm text-gray-600 mb-4">
                      {source.description || `${source.type} funding organization supporting climate finance initiatives in Bangladesh.`}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg p-6 mb-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-700 font-semibold">Disbursement Progress</div>
                    <div className="text-sm text-purple-600 font-bold">{disbursementRate.toFixed(1)}% Disbursed</div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Disbursed: {formatCurrency(source.total_disbursed)} of {formatCurrency(source.total_committed)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-700 ease-out shadow-sm"
                      style={{ width: `${disbursementRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Right Side: Source Details */}
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
                    <DollarSign size={16} className="mt-0.5 text-purple-600" />
                    <div>
                      <span className="font-semibold">Total Committed</span>
                      <div className="text-xs text-gray-600">{formatCurrency(source.total_committed)}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 text-purple-600" />
                    <div>
                      <span className="font-semibold">Total Disbursed</span>
                      <div className="text-xs text-gray-600">{formatCurrency(source.total_disbursed)}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target size={16} className="mt-0.5 text-purple-600" />
                    <div>
                      <span className="font-semibold">Active Projects</span>
                      <div className="text-xs text-gray-600">{source.active_projects} Projects</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 text-purple-600" />
                    <div>
                      <span className="font-semibold">Focus Sectors</span>
                      <div className="text-xs text-gray-600">{source.sectors.join(', ')}</div>
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
            {/* Financial Summary */}
            <Card className="mb-6" padding={true}>
              <div>
                <div className="font-semibold mb-4">Financial Summary</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(source.total_committed)}</div>
                    <div className="text-sm text-gray-600">Total Committed</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(source.total_disbursed)}</div>
                    <div className="text-sm text-gray-600">Total Disbursed</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{formatCurrency(source.total_committed - source.total_disbursed)}</div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sector Distribution */}
            <Card className="mb-6" padding={true}>
              <div>
                <div className="font-semibold mb-4">Sector Focus</div>
                <div className="flex flex-wrap gap-2">
                  {source.sectors.map((sector, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </>
        )}
        
        {/* Other tabs placeholder */}
        {activeTab !== 'Overview' && (
          <Card className="mb-6" padding={true}>
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{activeTab} Details</h3>
              <p className="text-gray-500">Detailed {activeTab.toLowerCase()} information will be available soon.</p>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default FundingSourceDetails;