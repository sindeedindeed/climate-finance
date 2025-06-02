import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { agencies } from '../data/mock/adminData';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import { ArrowLeft, Building2 } from 'lucide-react';

const AdminAgencyEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { agencyId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    agency_id: '',
    name: '',
    type: ''
  });

  const agencyTypes = ['Implementing', 'Executing', 'Accredited'];

  // Fetch agency data
  useEffect(() => {
    const fetchAgency = async () => {
      setIsDataLoading(true);
      try {
        // In a real app, you would fetch from API
        const agency = agencies.find(a => a.agency_id === parseInt(agencyId));
        
        if (!agency) {
          setError('Agency not found');
          return;
        }

        setFormData({
          agency_id: agency.agency_id,
          name: agency.name || '',
          type: agency.type || ''
        });
      } catch (err) {
        setError('Error loading agency data');
        console.error(err);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchAgency();
  }, [agencyId]);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const agencyData = {
        ...formData
      };

      console.log('Updated agency data:', agencyData);
      
      // Navigate back to agencies list
      navigate('/admin/agencies');
    } catch (error) {
      console.error('Error saving agency:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <Loading size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <Card padding={true}>
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <Building2 size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
            <p className="text-gray-500 mb-4">
              The agency you're looking for could not be found.
            </p>
            <Button onClick={() => navigate('/admin/agencies')} variant="primary">
              Back to Agencies
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
          <Link to="/admin/agencies" className="text-purple-600 hover:text-purple-700 transition-colors duration-200">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Agency</h2>
            <p className="text-gray-500">Modify agency information</p>
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
          {/* Header */}
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Agency Information</h3>
              <p className="text-sm text-gray-500">Update the agency details below</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Agency ID (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agency ID
              </label>
              <input
                type="text"
                value={formData.agency_id}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm bg-gray-50 text-gray-500"
                disabled
                readOnly
              />
            </div>

            {/* Agency Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agency Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter agency name"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Agency Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agency Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select Type</option>
                {agencyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type Descriptions */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Agency Type Descriptions:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Implementing:</span> Agencies responsible for direct project implementation and execution
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Executing:</span> Agencies that oversee and coordinate project activities
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Accredited:</span> Agencies certified to access and manage climate finance
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200"
            >
              {isLoading ? 'Updating...' : 'Update Agency'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/agencies')}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};

export default AdminAgencyEdit;