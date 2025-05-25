import React from 'react';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import StatCardList from '../components/ui/StatCardList';
import BarChartComponent from '../components/charts/BarChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
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
  // Format monetary values in stats with currency formatter
  const formattedStats = dashboardStats.map(stat => ({
    ...stat,
    value: typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value
  }));

  return (
    <PageLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Climate Finance Overview</h2>
      <p className="text-gray-500 mb-6">Track, analyze and visualize climate finance flows in Bangladesh</p>

      <StatCardList stats={formattedStats} />

      <Card className="mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <PieChartComponent 
            title="Sector Distribution" 
            data={sectorDistribution} 
          />
        </Card>

        <Card>
          <PieChartComponent 
            title="Funding Sources" 
            data={sourceDistribution} 
          />
        </Card>
      </div>

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
    </PageLayout>
  );
};

export default LandingPage;