import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Download,
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

// Import mock data as fallback
import { 
  monthlyFunding, 
  sectorDistribution, 
  sourceDistribution, 
  regionalDistribution, 
  dashboardStats 
} from '../data/mock/dashboardData';

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
        projectApi.getDashboardOverviewStats().catch(() => ({ status: false, data: null })),
        projectApi.getProjectsByStatus().catch(() => ({ status: false, data: [] })),
        projectApi.getProjectsBySector().catch(() => ({ status: false, data: [] })),
        projectApi.getRegionalDistribution().catch(() => ({ status: false, data: [] }))
      ]);

      // Set overview stats
      if (overviewResponse.status && overviewResponse.data) {
        const data = overviewResponse.data;
        setOverviewStats([
          {
            title: "Total Climate Finance",
            value: data.total_climate_finance || 200000000,
            change: "+18% from last year"
          },
          {
            title: "Adaptation Finance",
            value: data.adaptation_finance || 120000000,
            change: "+14% from last year"
          },
          {
            title: "Mitigation Finance", 
            value: data.mitigation_finance || 80000000,
            change: "+22% from last year"
          },
          {
            title: "Active Projects",
            value: data.active_projects || 42,
            change: "+8% from last year"
          }
        ]);
      } else {
        setOverviewStats(dashboardStats);
      }

      // Set projects by status for pie chart
      if (statusResponse.status && statusResponse.data) {
        setProjectsByStatus(statusResponse.data);
      } else {
        setProjectsByStatus([
          { name: "Active", value: 35 },
          { name: "Completed", value: 20 },
          { name: "Planning", value: 15 },
          { name: "On Hold", value: 5 }
        ]);
      }

      // Set projects by sector for pie chart  
      if (sectorResponse.status && sectorResponse.data) {
        setProjectsBySector(sectorResponse.data);
      } else {
        setProjectsBySector(sectorDistribution);
      }

      // Set regional data for bar chart
      if (regionalResponse.status && regionalResponse.data) {
        setRegionalData(regionalResponse.data);
      } else {
        setRegionalData(regionalDistribution);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Using fallback data.');
      
      // Set fallback data
      setOverviewStats(dashboardStats);
      setProjectsByStatus([
        { name: "Active", value: 35 },
        { name: "Completed", value: 20 },
        { name: "Planning", value: 15 },
        { name: "On Hold", value: 5 }
      ]);
      setProjectsBySector(sectorDistribution);
      setRegionalData(regionalDistribution);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);    
    try {
      await fetchDashboardData();
      toast.success('Dashboard data updated successfully');
    } catch {
      toast.error('Failed to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle export
  const handleExport = () => {
    toast.info('Export feature coming soon!');
  };

  // Add icons to stats
  const statsData = overviewStats.map((stat, index) => {
    const colors = ['primary', 'success', 'warning', 'primary'];
    const icons = [
      <DollarSign size={20} />,
      <Target size={20} />,
      <TrendingUp size={20} />,
      <Activity size={20} />
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
          <Button
            variant="primary"
            leftIcon={<Download size={16} />}
            onClick={handleExport}
            className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
          >
            Export Report
          </Button>
        </div>
      </div>

      {error && (
        <Card padding={true} className="mb-6">
          <div className="text-center py-4">
            <p className="text-yellow-600 text-sm mb-2">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Try again
            </button>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div 
            key={index} 
            className="animate-fade-in-up h-full"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              color={stat.color}
              icon={stat.icon}
            />
          </div>
        ))}
      </div> 
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">        
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <Card hover padding={true}>
            <PieChartComponent
              title="Projects by Sector" 
              data={projectsBySector} 
            />
          </Card>        
        </div>        
        <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <Card hover padding={true}>
            <PieChartComponent 
              title="Projects by Status" 
              data={projectsByStatus} 
            />
          </Card>
        </div>      
      </div>      
      
      {/* Regional Distribution */}      
      <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <Card>
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