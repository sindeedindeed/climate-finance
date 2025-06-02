import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fundingSources } from '../data/mock/adminData';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import { ArrowLeft } from 'lucide-react';

const AdminFundingSourceEdit = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { sourceId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSource, setLoadingSource] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    dev_partner: '',
    grant_amount: '',
    loan_amount: '',
    counterpart_funding: '',
    non_grant_instrument: ''
  });

  useEffect(() => {
    const fetchSource = async () => {
      setLoadingSource(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const source = fundingSources.find(s => s.funding_source_id === parseInt(sourceId));
        
        if (source) {
          setFormData({
            name: source.name,
            dev_partner: source.dev_partner,
            grant_amount: source.grant_amount || '',
            loan_amount: source.loan_amount || '',
            counterpart_funding: source.counterpart_funding || '',
            non_grant_instrument: source.non_grant_instrument || ''
          });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching funding source:', error);
        setNotFound(true);
      } finally {
        setLoadingSource(false);
      }
    };

    fetchSource();
  }, [sourceId]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const sourceData = {
        ...formData,
        funding_source_id: parseInt(sourceId),
        grant_amount: parseFloat(formData.grant_amount) || 0,
        loan_amount: parseFloat(formData.loan_amount) || 0,
        counterpart_funding: parseFloat(formData.counterpart_funding) || 0,
        non_grant_instrument: formData.non_grant_instrument || null
      };

      // In a real application, you would make an API call here
      console.log('Updated funding source:', sourceData);
      
      // Navigate back to the funding sources list
      navigate('/admin/funding-sources');
    } catch (error) {
      console.error('Error updating funding source:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingSource) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <Loading size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (notFound) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <Card padding={true}>
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Funding Source Not Found</h2>
            <p className="text-gray-600 mb-6">The funding source you are looking for does not exist or has been removed.</p>
            <Button 
              onClick={() => navigate('/admin/funding-sources')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Return to Funding Sources
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/admin/funding-sources" className="text-purple-600 hover:text-purple-700 transition-colors duration-200">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Funding Source</h2>
            <p className="text-gray-500">Update funding source information</p>
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

      {/* Form Card */}
      <Card hover padding={true}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Development Partner *</label>
              <input
                type="text"
                name="dev_partner"
                value={formData.dev_partner}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Grant Amount (USD)</label>
              <input
                type="number"
                name="grant_amount"
                value={formData.grant_amount}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Loan Amount (USD)</label>
              <input
                type="number"
                name="loan_amount"
                value={formData.loan_amount}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Counterpart Funding (USD)</label>
              <input
                type="number"
                name="counterpart_funding"
                value={formData.counterpart_funding}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Non-Grant Instrument</label>
              <input
                type="text"
                name="non_grant_instrument"
                value={formData.non_grant_instrument}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Concessional Loan, Technical Assistance"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              onClick={() => navigate('/admin/funding-sources')}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? <Loading size="sm" /> : 'Update Funding Source'}
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};

export default AdminFundingSourceEdit;