import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { agencyApi } from '../services/api';
import PageLayout from '../components/layouts/PageLayout';
import PageHeader from '../components/layouts/PageHeader';
import Form from '../components/ui/Form';
import FormSection from '../components/ui/FormSection';
import Loading from '../components/ui/Loading';
import ErrorState from '../components/ui/ErrorState';

const AgencyFormPage = ({ mode = 'add' }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    agency_id: '',
    name: '',
    type: '',
    category: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  // Fetch agency data for edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchAgency();
    }
  }, [mode, id]);

  const fetchAgency = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const response = await agencyApi.getById(id);
      if (response.status && response.data) {
        setFormData({
          agency_id: response.data.agency_id || '',
          name: response.data.name || '',
          type: response.data.type || '',
          category: response.data.category || ''
        });
      } else {
        throw new Error('Agency not found');
      }
    } catch (error) {
      console.error('Error fetching agency:', error);
      setError('Failed to load agency data');
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

    if (!formData.agency_id.trim()) {
      newErrors.agency_id = 'Agency ID is required';
    } else if (formData.agency_id.length < 2) {
      newErrors.agency_id = 'Agency ID must be at least 2 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Agency name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Agency name must be at least 2 characters';
    }

    if (!formData.type) {
      newErrors.type = 'Agency type is required';
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
      const agencyData = {
        agency_id: formData.agency_id.trim(),
        name: formData.name.trim(),
        type: formData.type,
        category: formData.category.trim() || null
      };

      if (mode === 'add') {
        await agencyApi.add(agencyData);
      } else {
        await agencyApi.update(id, agencyData);
      }

      navigate('/admin/agencies');
    } catch (error) {
      console.error('Error saving agency:', error);
      setError(error.message || 'Failed to save agency. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form field definitions
  const basicInfoFields = [
    {
      name: 'agency_id',
      label: 'Agency ID',
      type: 'text',
      placeholder: 'Enter unique agency ID',
      required: true
    },
    {
      name: 'name',
      label: 'Agency Name',
      type: 'text',
      placeholder: 'Enter agency name',
      required: true
    }
  ];

  const detailsFields = [
    {
      name: 'type',
      label: 'Agency Type',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Select agency type' },
        { value: 'Implementing', label: 'Implementing' },
        { value: 'Executing', label: 'Executing' },
        { value: 'Accredited', label: 'Accredited' }
      ]
    },
    {
      name: 'category',
      label: 'Category',
      type: 'text',
      placeholder: 'Enter agency category (optional)'
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
          title="Agency Not Found"
          message={error}
          onBack={() => navigate('/admin/agencies')}
          showBack={true}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <PageHeader
        title={mode === 'add' ? 'Add New Agency' : 'Edit Agency'}
        subtitle={mode === 'add' ? 'Create a new implementing or executing agency' : 'Update agency information'}
        backPath="/admin/agencies"
        showUserInfo={true}
      />

      {/* Form */}
      <Form
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitText={mode === 'add' ? 'Create Agency' : 'Update Agency'}
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

        {/* Agency Details Section */}
        <FormSection
          title="Agency Details"
          fields={detailsFields}
          formData={formData}
          onChange={handleInputChange}
          errors={errors}
          layout="grid"
        />
      </Form>
    </PageLayout>
  );
};

export default AgencyFormPage;
