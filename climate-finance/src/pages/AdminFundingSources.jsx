import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { fundingSources } from '../data/mock/adminData';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import { ArrowLeft, Search, Edit, Trash2, Plus } from 'lucide-react';

const AdminFundingSources = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sources, setSources] = useState(fundingSources);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDelete = async (sourceId) => {
    if (window.confirm('Are you sure you want to delete this funding source?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setSources(prev => prev.filter(s => s.funding_source_id !== sourceId));
      } catch (error) {
        console.error('Error deleting funding source:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredSources = sources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.dev_partner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard" className="text-purple-600 hover:text-purple-700 transition-colors duration-200">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Funding Sources Management</h2>
            <p className="text-gray-500">Manage funding sources and development partners</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>

      {/* Controls Card */}
      <Card hover className="mb-6" padding={true}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
            All Funding Sources ({filteredSources.length})
          </h3>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Search funding sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={() => navigate('/admin/funding-sources/add')} 
              variant="primary"
              leftIcon={<Plus size={16} />}
              className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
            >
              Add Funding Source
            </Button>
          </div>
        </div>
      </Card>

      {/* Funding Sources List */}
      <Card hover padding={true}>
        <div className="divide-y divide-gray-100">
          {filteredSources.map((source, index) => (
            <div 
              key={source.funding_source_id} 
              className="p-4 hover:bg-purple-50 transition-all duration-200 group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 min-w-0 mb-4 lg:mb-0">
                  <div className="flex items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                        {source.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{source.dev_partner}</p>
                      {source.non_grant_instrument && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 mt-2">
                          {source.non_grant_instrument}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap lg:items-center lg:space-x-8">
                  <div className="w-1/2 lg:w-auto mb-4 lg:mb-0">
                    <p className="text-xs text-gray-500">Grant Amount</p>
                    <p className="text-sm font-medium">{formatCurrency(source.grant_amount)}</p>
                  </div>
                  
                  <div className="w-1/2 lg:w-auto mb-4 lg:mb-0">
                    <p className="text-xs text-gray-500">Loan Amount</p>
                    <p className="text-sm font-medium">{formatCurrency(source.loan_amount)}</p>
                  </div>
                  
                  <div className="w-1/2 lg:w-auto mb-4 lg:mb-0">
                    <p className="text-xs text-gray-500">Counterpart Funding</p>
                    <p className="text-sm font-medium">{formatCurrency(source.counterpart_funding)}</p>
                  </div>
                  
                  <div className="w-1/2 lg:w-auto">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => navigate(`/admin/funding-sources/edit/${source.funding_source_id}`)}
                        size="sm"
                        variant="outline"
                        leftIcon={<Edit size={14} />}
                        className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-200"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(source.funding_source_id)}
                        size="sm"
                        variant="outline"
                        leftIcon={<Trash2 size={14} />}
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-all duration-200"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredSources.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No funding sources found</h3>
            <p className="text-gray-500 mb-4">
              No funding sources match your search criteria.
            </p>
          </div>
        )}
      </Card>
    </PageLayout>
  );
};

export default AdminFundingSources;