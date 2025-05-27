import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Target,
  ArrowRight,
  Download,
  RefreshCw
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

// Import mock data
import { 
  monthlyFunding, 
  sectorDistribution, 
  sourceDistribution, 
  regionalDistribution, 
  dashboardStats 
} from '../data/mock/dashboardData';

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
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
  const statsWithIcons = dashboardStats.map((stat, index) => {
    const icons = [
      <DollarSign size={20} />,
      <TrendingUp size={20} />,
      <Target size={20} />,
      <Activity size={20} />
    ];
    
    const colors = ['primary', 'success', 'warning', 'primary'];
    
    return {
      ...stat,
      value: typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value,
      icon: icons[index],
      color: colors[index]
    };
  });

  if (loading) {
    return (
      <PageLayout>
        <Loading 
          type="spinner" 
          size="lg" 
          text="Loading dashboard data..." 
          fullScreen={false} 
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Climate Finance Overview
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
          </Button>          <Button
            variant="primary"
            leftIcon={<Download size={16} />}
            onClick={handleExport}
            className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsWithIcons.map((stat, index) => (
          <div 
            key={index} 
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
            />
          </div>
        ))}
      </div>

      {/* Monthly Funding Chart */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <Card gradient>
          <BarChartComponent 
            title="Monthly Funding Allocation" 
            data={monthlyFunding} 
            xAxisKey="month"
            bars={[
              { dataKey: 'adaptation', fill: CHART_COLORS[0], name: 'Adaptation' },
              { dataKey: 'mitigation', fill: CHART_COLORS[1], name: 'Mitigation' }
            ]}
            formatYAxis={true}
          />
        </Card>
      </div>

      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <Card hover>
            <PieChartComponent 
              title="Sector Distribution" 
              data={sectorDistribution} 
            />
          </Card>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <Card hover>
            <PieChartComponent 
              title="Funding Sources" 
              data={sourceDistribution} 
            />
          </Card>
        </div>
      </div>

      {/* Regional Distribution */}
      <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <Card>
          <BarChartComponent 
            title="Regional Distribution" 
            data={regionalDistribution} 
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-1">
              Ready to dive deeper?
            </h3>
            <p className="text-primary-700">
              Explore detailed project tracking and funding source analysis.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              rightIcon={<ArrowRight size={16} />}
              onClick={() => window.location.href = '/projects'}
            >
              View Projects
            </Button>
            <Button 
              variant="primary"
              rightIcon={<ArrowRight size={16} />}
              onClick={() => window.location.href = '/funding-sources'}
            >
              Explore Funding
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LandingPage;