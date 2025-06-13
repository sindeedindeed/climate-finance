import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fundingSourceApi } from '../services/api';
import PageLayout from '../components/layouts/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import ErrorState from '../components/ui/ErrorState';
import { ArrowLeft, Save, X } from 'lucide-react';

const FundingSourceFormPage = ({ mode = 'add' }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dev_partner: '',
    grant_amount: '',
    loan_amount: '',
    counterpart_funding: '',
    disbursement: '',
    non_grant_instrument: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  // Fetch funding source data for edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchFundingSource();
    }
  }, [mode, id]);

  const fetchFundingSource = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const response = await fundingSourceApi.getById(id);
      if (response.status && response.data) {
        setFormData({
          name: response.data.name || '',
          dev_partner: response.data.dev_partner || '',
          grant_amount: response.data.grant_amount || '',
          loan_amount: response.data.loan_amount || '',
          counterpart_funding: response.data.counterpart_funding || '',
          disbursement: response.data.disbursement || '',
          non_grant_instrument: response.data.non_grant_instrument || ''
        });
      } else {
        throw new Error('Funding source not found');
      }
    } catch (error) {
      console.error('Error fetching funding source:', error);
      setError('Failed to load funding source data');
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Funding source name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Funding source name must be at least 2 characters';
    }

    if (!formData.dev_partner.trim()) {
      newErrors.dev_partner = 'Development partner is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const fundingSourceData = {
        name: formData.name.trim(),
        dev_partner: formData.dev_partner.trim(),
        grant_amount: parseFloat(formData.grant_amount) || 0,
        loan_amount: parseFloat(formData.loan_amount) || 0,
        counterpart_funding: parseFloat(formData.counterpart_funding) || 0,
        disbursement: parseFloat(formData.disbursement) || 0,
        non_grant_instrument: formData.non_grant_instrument.trim() || null
      };

      if (mode === 'add') {
        await fundingSourceApi.add(fundingSourceData);
      } else {
        await fundingSourceApi.update(id, fundingSourceData);
      }

      navigate('/admin/funding-sources');
    } catch (error) {
      console.error('Error saving funding source:', error);
      setError(error.message || 'Failed to save funding source. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="flex justify-center items-center min-h-64">
          <Loading size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (error && mode === 'edit') {
    return (
      <PageLayout bgColor="bg-gray-50">
        <ErrorState
          title="Funding Source Not Found"
          message={error}
          onBack={() => navigate('/admin/funding-sources')}
          showBack={true}
        />
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
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === 'add' ? 'Add New Funding Source' : 'Edit Funding Source'}
            </h2>
            <p className="text-gray-500">
              {mode === 'add' ? 'Create a new funding source for climate projects' : 'Update funding source information'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card padding={true}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Global error display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Funding Source Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter funding source name"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Partner Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Partner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Development Partner <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dev_partner"
                  value={formData.dev_partner}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.dev_partner ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter development partner name"
                  required
                />
                {errors.dev_partner && (
                  <p className="mt-1 text-sm text-red-600">{errors.dev_partner}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Non-Grant Instrument</label>
                <input
                  type="text"
                  name="non_grant_instrument"
                  value={formData.non_grant_instrument}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Loan Agreement, Credit Line"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Grant Amount (USD)</label>
                <input
                  type="number"
                  name="grant_amount"
                  value={formData.grant_amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.00"
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
                  placeholder="0.00"
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
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Disbursement (USD)</label>
                <input
                  type="number"
                  name="disbursement"
                  value={formData.disbursement}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              onClick={() => navigate('/admin/funding-sources')}
              variant="outline"
              leftIcon={<X size={16} />}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              leftIcon={<Save size={16} />}
              className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
              disabled={isLoading}
              loading={isLoading}
            >
              {mode === 'add' ? 'Create Funding Source' : 'Update Funding Source'}
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};

export default FundingSourceFormPage;
