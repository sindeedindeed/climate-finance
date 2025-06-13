import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { locationApi } from '../services/api';
import PageLayout from '../components/layouts/PageLayout';
import PageHeader from '../components/layouts/PageHeader';
import Form from '../components/ui/Form';
import FormSection from '../components/ui/FormSection';
import Loading from '../components/ui/Loading';
import ErrorState from '../components/ui/ErrorState';

const LocationFormPage = ({ mode = 'add' }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location_id: '',
    name: '',
    region: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  // Fetch location data for edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchLocation();
    }
  }, [mode, id]);

  const fetchLocation = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const response = await locationApi.getById(id);
      if (response.status && response.data) {
        setFormData({
          location_id: response.data.location_id || '',
          name: response.data.name || '',
          region: response.data.region || ''
        });
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setError('Failed to load location data');
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

    if (!formData.location_id.trim()) {
      newErrors.location_id = 'Location ID is required';
    } else if (formData.location_id.length < 2) {
      newErrors.location_id = 'Location ID must be at least 2 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Location name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Location name must be at least 2 characters';
    }

    if (!formData.region) {
      newErrors.region = 'Region is required';
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
      const locationData = {
        location_id: formData.location_id.trim(),
        name: formData.name.trim(),
        region: formData.region
      };

      if (mode === 'add') {
        await locationApi.add(locationData);
      } else {
        await locationApi.update(id, locationData);
      }

      navigate('/admin/locations');
    } catch (error) {
      console.error('Error saving location:', error);
      setError(error.message || 'Failed to save location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form field definitions
  const basicInfoFields = [
    {
      name: 'location_id',
      label: 'Location ID',
      type: 'text',
      placeholder: 'Enter unique location ID',
      required: true
    },
    {
      name: 'name',
      label: 'Location Name',
      type: 'text',
      placeholder: 'Enter location name',
      required: true
    }
  ];

  const regionFields = [
    {
      name: 'region',
      label: 'Region',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Select region' },
        { value: 'Central', label: 'Central' },
        { value: 'Northeast', label: 'Northeast' },
        { value: 'Northwest', label: 'Northwest' },
        { value: 'Southwest', label: 'Southwest' },
        { value: 'Southeast', label: 'Southeast' },
        { value: 'Chittagong', label: 'Chittagong' }
      ],
      fullWidth: true
    }
  ];

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
          title="Location Not Found"
          message={error}
          onBack={() => navigate('/admin/locations')}
          showBack={true}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <PageHeader
        title={mode === 'add' ? 'Add New Location' : 'Edit Location'}
        subtitle={mode === 'add' ? 'Create a new project location' : 'Update location information'}
        backPath="/admin/locations"
        showUserInfo={true}
      />

      {/* Form */}
      <Form
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitText={mode === 'add' ? 'Create Location' : 'Update Location'}
        showBackButton={false}
        layout="sections"
      >
        {/* Global error display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Basic Information Section */}
        <FormSection
          title="Basic Information"
          fields={basicInfoFields}
          formData={formData}
          onChange={handleInputChange}
          errors={errors}
          layout="grid"
        />

        {/* Region Section */}
        <FormSection
          title="Geographic Information"
          fields={regionFields}
          formData={formData}
          onChange={handleInputChange}
          errors={errors}
          layout="single"
        />
      </Form>
    </PageLayout>
  );
};

export default LocationFormPage;