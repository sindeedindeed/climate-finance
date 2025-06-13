import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { focalAreaApi } from '../services/api';
import PageLayout from '../components/layouts/PageLayout';
import PageHeader from '../components/layouts/PageHeader';
import Form from '../components/ui/Form';
import FormSection from '../components/ui/FormSection';
import Loading from '../components/ui/Loading';
import ErrorState from '../components/ui/ErrorState';

const FocalAreaFormPage = ({ mode = 'add' }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  // Fetch focal area data for edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchFocalArea();
    }
  }, [mode, id]);

  const fetchFocalArea = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const response = await focalAreaApi.getById(id);
      if (response.status && response.data) {
        setFormData({
          name: response.data.name || ''
        });
      } else {
        throw new Error('Focal area not found');
      }
    } catch (error) {
      console.error('Error fetching focal area:', error);
      setError('Failed to load focal area data');
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
      newErrors.name = 'Focal area name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Focal area name must be at least 2 characters';
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
      const focalAreaData = {
        name: formData.name.trim()
      };

      if (mode === 'add') {
        await focalAreaApi.add(focalAreaData);
      } else {
        await focalAreaApi.update(id, focalAreaData);
      }

      navigate('/admin/focal-areas');
    } catch (error) {
      console.error('Error saving focal area:', error);
      setError(error.message || 'Failed to save focal area. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form field definitions
  const basicInfoFields = [
    {
      name: 'name',
      label: 'Focal Area Name',
      type: 'text',
      placeholder: 'Enter focal area name (e.g., Renewable Energy, Climate Adaptation)',
      required: true,
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
          title="Focal Area Not Found"
          message={error}
          onBack={() => navigate('/admin/focal-areas')}
          showBack={true}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <PageHeader
        title={mode === 'add' ? 'Add New Focal Area' : 'Edit Focal Area'}
        subtitle={mode === 'add' ? 'Create a new project focal area' : 'Update focal area information'}
        backPath="/admin/focal-areas"
        showUserInfo={true}
      />

      {/* Form */}
      <Form
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitText={mode === 'add' ? 'Create Focal Area' : 'Update Focal Area'}
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
          subtitle="Define the focal area for climate projects"
          fields={basicInfoFields}
          formData={formData}
          onChange={handleInputChange}
          errors={errors}
          layout="single"
        />
      </Form>
    </PageLayout>
  );
};

export default FocalAreaFormPage;