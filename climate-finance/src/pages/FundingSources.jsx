import React, { useState } from 'react';
import { Search, Filter, Download, ExternalLink } from 'lucide-react';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import PieChartComponent from '../components/charts/PieChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import BarChartComponent from '../components/charts/BarChartComponent';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { CHART_COLORS } from '../utils/constants';

// Import mock data
import { fundingSources } from '../data/mock/fundingSources';
import { fundingByType, fundingTrend, sectorAllocation, overviewStats } from '../data/mock/fundingMetrics';

const FundingSources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  
  // Filter sources based on search and type filter
  const filteredSources = fundingSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || source.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Export filtered data
  const handleExport = () => {
    const exportData = {
      totalSources: filteredSources.length,
      fundingSources: filteredSources,
      overviewStats,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `funding_sources_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Funding Sources</h2>
          <p className="text-gray-500">Track and analyze climate finance sources in Bangladesh</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 md:mt-0">
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex items-center space-x-1"
          >
            <Filter size={16} />
            <span>Filters</span>
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
        {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {overviewStats.map((stat, index) => (
          <div 
            key={index}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatCard 
              title={stat.title}
              value={formatCurrency(stat.value)}
              change={stat.change}
            />
          </div>
        ))}
      </div>
        {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Funding by Type */}
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Card hover>
            <PieChartComponent
              title="Funding by Source Type"
              data={fundingByType}
              valueKey="value"
              nameKey="name"
            />
          </Card>
        </div>
        
        {/* Funding Trend */}
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <Card hover>
            <LineChartComponent
              title="Funding Trend"
              data={fundingTrend}
              xAxisKey="year"
              yAxisKey="amount"
              formatYAxis={true}
              lineName="Amount"
            />
          </Card>
        </div>
      </div>      
      {/* Sector Allocation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <Card hover className="mb-6">
          <BarChartComponent
            title="Sector Allocation"
            data={sectorAllocation.map(item => ({
              sector: item.name,
              amount: item.value
            }))}
            xAxisKey="sector"
            bars={[{ dataKey: 'amount', fill: CHART_COLORS[0], name: 'Amount' }]}
            formatYAxis={true}
          />
        </Card>
      </div>
        {/* Funding Sources List */}
      <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <Card hover className="mb-6">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">Climate Finance Sources</h3>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Search sources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Type Filter */}
                <select
                  className="block w-full sm:w-auto border border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Multilateral">Multilateral</option>
                  <option value="Bilateral">Bilateral</option>
                  <option value="National">National</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>
          </div>
          {/* Sources List */}
        <div className="divide-y divide-gray-100">
          {filteredSources.map((source, index) => (
            <div 
              key={source.id} 
              className="p-4 hover:bg-purple-50 transition-all duration-200 group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex items-center mb-4 md:mb-0 md:mr-4">
                  <img src={source.logo} alt={source.name} className="w-12 h-12 rounded mr-4" />
                  <div>
                    <h4 className="text-md font-medium text-gray-800">{source.name}</h4>
                    <span className="text-sm text-gray-500">{source.type}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap md:ml-auto">
                  <div className="w-1/2 md:w-auto md:mr-8 mb-4 md:mb-0">
                    <p className="text-xs text-gray-500">Committed</p>
                    <p className="text-sm font-medium">{formatCurrency(source.total_committed)}</p>
                  </div>
                  
                  <div className="w-1/2 md:w-auto md:mr-8 mb-4 md:mb-0">
                    <p className="text-xs text-gray-500">Disbursed</p>
                    <p className="text-sm font-medium">{formatCurrency(source.total_disbursed)}</p>
                  </div>
                  
                  <div className="w-1/2 md:w-auto md:mr-8">
                    <p className="text-xs text-gray-500">Active Projects</p>
                    <p className="text-sm font-medium">{source.active_projects}</p>
                  </div>
                  
                  <div className="w-1/2 md:w-auto">
                    <p className="text-xs text-gray-500">Sectors</p>
                    <p className="text-sm font-medium">{source.sectors.slice(0, 2).join(', ')}{source.sectors.length > 2 ? '...' : ''}</p>
                  </div>
                    <a href="#" className="text-purple-600 text-sm flex items-center mt-4 md:mt-0 md:ml-4 hover:text-purple-700 group-hover:gap-2 transition-all">
                    View Details
                    <ExternalLink size={14} className="ml-1 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
                <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${(source.total_disbursed / source.total_committed) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">Disbursement Progress</p>
                  <p className="text-xs text-gray-500">{Math.round((source.total_disbursed / source.total_committed) * 100)}%</p>
                </div>
              </div>
            </div>
          ))}
            {filteredSources.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No funding sources match your search criteria.</p>
            </div>
          )}
        </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default FundingSources;
