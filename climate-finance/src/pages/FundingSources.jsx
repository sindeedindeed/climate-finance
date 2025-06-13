import React, { useState, useEffect } from 'react';
import { Download, Building, Globe, ExternalLink, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layouts/PageLayout';
import PageHeader from '../components/layouts/PageHeader';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import PieChartComponent from '../components/charts/PieChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import BarChartComponent from '../components/charts/BarChartComponent';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import SearchFilter from '../components/ui/SearchFilter';
import { formatCurrency } from '../utils/formatters';
import { CHART_COLORS } from '../utils/constants';
import { generateOrganizationLogo } from '../utils/svgPlaceholder';
import { projectApi, fundingSourceApi } from '../services/api';

// Import mock data as fallback
import { fundingSources } from '../data/mock/fundingSources';

const FundingSources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // API data states
  const [fundingSourcesList, setFundingSourcesList] = useState([]);
  const [overviewStats, setOverviewStats] = useState([]);
  const [fundingByType, setFundingByType] = useState([]);
  const [fundingTrend, setFundingTrend] = useState([]);
  const [sectorAllocation, setSectorAllocation] = useState([]);

  // Calculate fundingTypes AFTER fundingSourcesList is populated
  const fundingTypes = React.useMemo(() => {
    if (!Array.isArray(fundingSourcesList) || fundingSourcesList.length === 0) {
      return ['All', 'Multilateral', 'Bilateral', 'Private', 'Climate Fund', 'National'];
    }
    return ['All', ...new Set(fundingSourcesList.map(source => source.type).filter(Boolean))];
  }, [fundingSourcesList]);

  // Calculate stats from actual data
  const getStatsFromData = (sources) => {
    if (!Array.isArray(sources) || sources.length === 0) {
      return [
        { title: "Total Climate Finance", value: 0, change: "No data available" },
        { title: "Active Funding Sources", value: 0, change: "No sources found" },
        { title: "Committed Funds", value: 0, change: "No commitments" },
        { title: "Disbursed Funds", value: 0, change: "No disbursements" }
      ];
    }

    const totalCommitted = sources.reduce((sum, source) => 
      sum + (parseFloat(source.total_committed) || parseFloat(source.grant_amount) || 0), 0);
    const totalDisbursed = sources.reduce((sum, source) => 
      sum + (parseFloat(source.total_disbursed) || parseFloat(source.disbursement) || 0), 0);
    const activeSources = sources.filter(source => 
      source.status === 'Active' || !source.status).length;

    return [
      { 
        title: "Total Climate Finance", 
        value: totalCommitted, 
        change: "+15% from previous year" 
      },
      { 
        title: "Active Funding Sources", 
        value: activeSources, 
        change: `Across ${new Set(sources.map(s => s.type).filter(Boolean)).size} categories` 
      },
      { 
        title: "Committed Funds", 
        value: totalCommitted, 
        change: `${sources.length} funding sources` 
      },
      { 
        title: "Disbursed Funds", 
        value: totalDisbursed, 
        change: totalCommitted > 0 ? `${Math.round((totalDisbursed / totalCommitted) * 100)}% of committed funds` : "No disbursements" 
      }
    ];
  };

  // Calculate chart data from actual sources
  const getChartDataFromSources = (sources) => {
    if (!Array.isArray(sources) || sources.length === 0) {
      return {
        fundingByType: [],
        sectorAllocation: []
      };
    }

    // Group by type
    const typeGroups = sources.reduce((acc, source) => {
      const type = source.type || 'Unknown';
      const amount = parseFloat(source.total_committed) || parseFloat(source.grant_amount) || 0;
      acc[type] = (acc[type] || 0) + amount;
      return acc;
    }, {});

    const fundingByType = Object.entries(typeGroups).map(([name, value]) => ({
      name,
      value
    }));

    // Group by sectors (if available)
    const sectorGroups = sources.reduce((acc, source) => {
      const sectors = source.sectors || [];
      const amount = (parseFloat(source.total_committed) || parseFloat(source.grant_amount) || 0) / (sectors.length || 1);
      
      if (Array.isArray(sectors) && sectors.length > 0) {
        sectors.forEach(sector => {
          acc[sector] = (acc[sector] || 0) + amount;
        });
      } else {
        acc['Unspecified'] = (acc['Unspecified'] || 0) + amount;
      }
      return acc;
    }, {});

    const sectorAllocation = Object.entries(sectorGroups).map(([name, value]) => ({
      name,
      value
    }));

    return { fundingByType, sectorAllocation };
  };

  // Default fallback data
  const getDefaultFundingTrend = () => [
    { year: 2020, amount: 150000000 },
    { year: 2021, amount: 210000000 },
    { year: 2022, amount: 280000000 },
    { year: 2023, amount: 350000000 },
    { year: 2024, amount: 290000000 }
  ];

  // Fetch all funding source data
  useEffect(() => {
    fetchAllFundingData();
  }, []);

  const fetchAllFundingData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch funding sources first
      const fundingSourceResponse = await fundingSourceApi.getAll().catch(() => ({ status: false, data: [] }));
      
      let sources = [];
      if (fundingSourceResponse.status && Array.isArray(fundingSourceResponse.data)) {
        sources = fundingSourceResponse.data;
      } else {
        console.log('API failed, using mock data');
        sources = fundingSources || [];
      }
      
      setFundingSourcesList(sources);

      // Calculate stats and chart data from actual sources
      const calculatedStats = getStatsFromData(sources);
      const chartData = getChartDataFromSources(sources);
      
      setOverviewStats(calculatedStats);
      setFundingByType(chartData.fundingByType);
      setSectorAllocation(chartData.sectorAllocation);

      // Try to fetch additional chart data from API
      const [trendResponse] = await Promise.all([
        projectApi.getFundingSourceTrend().catch(() => ({ status: false, data: [] }))
      ]);

      // Set funding trend
      if (trendResponse.status && Array.isArray(trendResponse.data) && trendResponse.data.length > 0) {
        setFundingTrend(trendResponse.data);
      } else {
        setFundingTrend(getDefaultFundingTrend());
      }

    } catch (error) {
      console.error('Error fetching funding source data:', error);
      setError('Failed to load funding source data. Please try again.');

      // Set fallback data
      const fallbackSources = fundingSources || [];
      setFundingSourcesList(fallbackSources);
      setOverviewStats(getStatsFromData(fallbackSources));
      
      const chartData = getChartDataFromSources(fallbackSources);
      setFundingByType(chartData.fundingByType);
      setSectorAllocation(chartData.sectorAllocation);
      setFundingTrend(getDefaultFundingTrend());
    } finally {
      setIsLoading(false);
    }
  };

  // Better filtering with null checks
  const filteredSources = React.useMemo(() => {
    if (!Array.isArray(fundingSourcesList)) return [];
    
    return fundingSourcesList.filter(source => {
      const matchesSearch = (source.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                           (source.dev_partner?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'All' || source.type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [fundingSourcesList, searchTerm, filterType]);

  if (isLoading) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="flex justify-center items-center min-h-64">
          <Loading size="lg" text="Loading funding sources..." />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header - Using reusable component */}
      <PageHeader
        title="Funding Sources"
        subtitle="Explore climate finance funding sources and their contributions"
        actions={
          <Button
            leftIcon={<Download size={16} />}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Export Data
          </Button>
        }
      />

      {error && (
        <Card padding={true} className="mb-6">
          <div className="text-center py-4">
            <p className="text-red-600 text-sm mb-2">{error}</p>
            <button
              onClick={fetchAllFundingData}
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Try again
            </button>
          </div>
        </Card>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.isArray(overviewStats) && overviewStats.length > 0 && overviewStats.map((stat, index) => {
          const icons = [<DollarSign size={20} />, <Building size={20} />, <TrendingUp size={20} />, <CheckCircle size={20} />];
          return (
            <div 
              key={index}
              className="animate-fade-in-up h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatCard 
                title={stat.title}
                value={formatCurrency(stat.value)}
                change={stat.change}
                color={index % 2 === 0 ? 'primary' : 'success'}
                icon={icons[index]}
              />
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 mb-6">
        {/* Funding by Type */}
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Card hover padding={true}>
            <PieChartComponent
              title="Funding by Source Type"
              data={Array.isArray(fundingByType) ? fundingByType : []}
              valueKey="value"
              nameKey="name"
            />
          </Card>
        </div>

        {/* Funding Trend */}
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <Card hover padding={true}>
            <LineChartComponent
              title="Funding Trend"
              data={Array.isArray(fundingTrend) ? fundingTrend : []}
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
        <Card hover className="mb-6" padding={true}>
          <BarChartComponent
            title="Sector Allocation"
            data={Array.isArray(sectorAllocation) ? sectorAllocation.map(item => ({
              sector: item.name,
              amount: item.value
            })) : []}
            xAxisKey="sector"
            bars={[{ dataKey: 'amount', fill: CHART_COLORS[0], name: 'Amount' }]}
            formatYAxis={true}
          />
        </Card>
      </div>

      {/* Funding Sources List */}
      <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <Card hover className="mb-6" padding={true}>
          <div className="border-b border-gray-100 pb-8 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">Climate Finance Sources</h3>
              
              {/* Search and Filter - Using reusable component */}
              <SearchFilter
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search funding sources..."
                filters={[
                  {
                    value: filterType,
                    onChange: setFilterType,
                    options: fundingTypes.map(type => ({
                      value: type,
                      label: type === 'All' ? 'All Types' : type
                    }))
                  }
                ]}
                className="mt-4 md:mt-0"
              />
            </div>

            <div className="text-sm text-gray-500 mt-2">
              Showing {filteredSources.length} of {fundingSourcesList.length} funding sources
            </div>
          </div>

          {/* Sources Grid */}
          <div className="grid gap-6">
            {filteredSources.map((source, index) => (
              <div 
                key={source.funding_source_id || source.id || index}
                className="flex flex-col lg:flex-row lg:items-center p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
              >
                {/* Logo and Basic Info */}
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-100 group-hover:border-purple-200 transition-colors"
                      dangerouslySetInnerHTML={{ 
                        __html: generateOrganizationLogo(source.name || 'Unknown', 64) 
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 sm:mb-0">
                        {source.name || 'Unknown Source'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {source.type && (
                          <span className="inline-flex px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                            {source.type}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {source.dev_partner && (
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Globe size={14} className="mr-2 flex-shrink-0" />
                        <span>Development Partner: {source.dev_partner}</span>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      {source.description || 'Climate finance funding source'}
                    </div>
                  </div>
                </div>

                {/* Financial Info and Actions - All side by side */}
                <div className="mt-6 lg:mt-0 lg:ml-6 flex-shrink-0">
                  {/* All items in one flex row */}
                  <div className="flex items-end gap-4 lg:gap-6">
                    {/* Grant Amount */}
                    {(source.grant_amount || source.total_committed) && (
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">
                          {source.grant_amount ? 'Grant Amount' : 'Total Committed'}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(source.grant_amount || source.total_committed)}
                        </div>
                      </div>
                    )}
                    
                    {/* Disbursed */}
                    {(source.disbursement || source.total_disbursed) && (
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Disbursed</div>
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(source.disbursement || source.total_disbursed)}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          // Use the correct ID field for navigation
                          const id = source.funding_source_id || source.id;
                          navigate(`/funding-sources/${id}`);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-purple-600 border-purple-600 hover:bg-purple-50"
                      >
                        <ExternalLink size={14} />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSources.length === 0 && (
            <div className="text-center py-12">
              <Building size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No funding sources found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default FundingSources;
