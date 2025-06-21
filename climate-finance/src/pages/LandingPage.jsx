import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Target,
  Activity
} from 'lucide-react';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import BarChartComponent from '../components/charts/BarChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import { useToast } from '../components/ui/Toast';
import { CHART_COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { projectApi } from '../services/api';
import ExportButton from '../components/ui/ExportButton';

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // API data states
  const [overviewStats, setOverviewStats] = useState([]);
  const [projectsByStatus, setProjectsByStatus] = useState([]);
  const [projectsBySector, setProjectsBySector] = useState([]);
  const [regionalData, setRegionalData] = useState([]);

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [
        overviewResponse,
        statusResponse,
        sectorResponse,
        regionalResponse
      ] = await Promise.all([
        projectApi.getOverviewStats(),
        projectApi.getByStatus(),
        projectApi.getBySector(),
        projectApi.getRegionalDistribution()
      ]);

      // Set overview stats
      if (overviewResponse.status && overviewResponse.data) {
        const data = overviewResponse.data;
        const currentYear = data.current_year || {};
        
        // Helper function to calculate percentage change
        const calculateChange = (total, current) => {
          if (!total || !current || total === current) return "No previous data";
          const previous = total - current;
          if (previous <= 0) return "No comparison available";
          const percentage = Math.round(((current / previous) - 1) * 100);
          return percentage >= 0 ? `+${percentage}% from last year` : `${percentage}% from last year`;
        };
        
        setOverviewStats([
          {
            title: "Total Climate Finance",
            value: data.total_climate_finance || 0,
            change: calculateChange(data.total_climate_finance, currentYear.total_climate_finance)
          },
          {
            title: "Active Projects",
            value: data.active_projects || 0,
            change: calculateChange(data.active_projects, currentYear.active_projects)
          },
          {
            title: "Total Investment",
            value: data.total_climate_finance || 0, // ✅ Fixed: Use total_climate_finance instead of total_investment
            change: calculateChange(data.total_climate_finance, currentYear.total_climate_finance)
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

      // Set projects by status for pie chart
      if (statusResponse.status && Array.isArray(statusResponse.data)) {
        setProjectsByStatus(statusResponse.data);
      } else {
        setProjectsByStatus([]);
      }

      // Set projects by sector for pie chart  
      if (sectorResponse.status && Array.isArray(sectorResponse.data)) {
        setProjectsBySector(sectorResponse.data);
      } else {
        setProjectsBySector([]);
      }

      // Set regional data for bar chart
      if (regionalResponse.status && Array.isArray(regionalResponse.data)) {
        // ✅ Fix: Map API data structure - backend returns {location_name, adaptation_total, mitigation_total}
        setRegionalData(regionalResponse.data.map(item => ({
          region: item.location_name,
          adaptation: item.adaptation_total || 0,
          mitigation: item.mitigation_total || 0
        })));
      } else {
        setRegionalData([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      
      // Clear all data on error
      setOverviewStats([]);
      setProjectsByStatus([]);
      setProjectsBySector([]);
      setRegionalData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);    
    try {
      await fetchDashboardData();
      if (!error) {
        toast.success('Dashboard data updated successfully');
      }
    } catch {
      toast.error('Failed to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  // Prepare export data
  const getExportData = () => {
    if (overviewStats.length === 0) {
      return null;
    }
    
    return {
      overview: overviewStats,
      projectsByStatus,
      projectsBySector,
      regionalData,
      summary: {
        totalProjects: overviewStats.find(s => s.title.includes('Projects'))?.value || 0,
        totalFunding: overviewStats.find(s => s.title.includes('Finance'))?.value || 0,
        activeSources: overviewStats.find(s => s.title.includes('Sources'))?.value || 0
      }
    };
  };

  // Add icons to stats
  const statsData = overviewStats.map((stat, index) => {
    const colors = ['primary', 'success', 'warning', 'primary'];
    const icons = [
      <DollarSign size={20} />,
      <Activity size={20} />,
      <TrendingUp size={20} />,
      <Target size={20} />
    ];
    
    return {
      ...stat,
      color: colors[index],
      icon: icons[index]
    };
  });

  if (loading) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="flex justify-center items-center min-h-64">
          <Loading size="lg" text="Loading dashboard..." />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Climate Finance Dashboard
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Track, analyze and visualize climate finance flows in Bangladesh with 
            real-time insights and comprehensive reporting.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            leftIcon={<RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />}
            onClick={handleRefresh}
            disabled={refreshing}
            loading={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>          
          <ExportButton
            data={getExportData()}
            filename="climate_finance_dashboard"
            title="Bangladesh Climate Finance Dashboard"
            subtitle="Overview of climate finance data and project statistics"
            variant="export"
            exportFormats={['pdf', 'json']}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {error && (
        <Card padding={true} className="mb-6">
          <div className="text-center py-4">
            <p className="text-red-600 text-sm mb-2">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Try again
            </button>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
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
                value={stat.title.includes('Finance') || stat.title.includes('Investment') ? formatCurrency(stat.value) : stat.value}
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
              <p className="text-gray-500">No overview statistics available</p>
            </div>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">        
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <Card hover padding={true}>
            {projectsBySector.length > 0 ? (
              <PieChartComponent
                title="Projects by Sector" 
                data={projectsBySector} 
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-gray-500">No sector data available</p>
              </div>
            )}
          </Card>        
        </div>        
        <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <Card hover padding={true}>
            {projectsByStatus.length > 0 ? (
              <PieChartComponent 
                title="Projects by Status" 
                data={projectsByStatus} 
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-gray-500">No status data available</p>
              </div>
            )}
          </Card>
        </div>      
      </div>      
      
      {/* Regional Distribution */}      
      <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <Card>
          {regionalData.length > 0 ? (
            <BarChartComponent
              title="Regional Distribution" 
              data={regionalData} 
              xAxisKey="region"
              bars={[
                { dataKey: 'adaptation', fill: CHART_COLORS[0], name: 'Adaptation' },
                { dataKey: 'mitigation', fill: CHART_COLORS[1], name: 'Mitigation' }
              ]}
              formatYAxis={true}
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center p-6">
              <p className="text-gray-500">No regional data available</p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl border border-primary-200 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Explore Climate Finance Data</h3>
          <p className="text-gray-600">Access detailed reports and analytics</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/projects')}
            rightIcon={<ArrowRight size={16} />}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            View Projects
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/funding-sources')}
            rightIcon={<ArrowRight size={16} />}
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            Funding Sources
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default LandingPage;