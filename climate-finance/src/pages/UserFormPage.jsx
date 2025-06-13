import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import PageLayout from '../components/layouts/PageLayout';
import PageHeader from '../components/layouts/PageHeader';
import Form from '../components/ui/Form';
import FormSection from '../components/ui/FormSection';
import Loading from '../components/ui/Loading';
import ErrorState from '../components/ui/ErrorState';

const UserFormPage = ({ mode = 'add' }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    role: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  // Fetch user data for edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchUser();
    }
  }, [mode, id]);

  const fetchUser = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const response = await userApi.getById(id);
      if (response.status && response.data) {
        setFormData({
          full_name: response.data.full_name || '',
          username: response.data.username || '',
          email: response.data.email || '',
          role: response.data.role || '',
          password: '' // Don't pre-fill password for security
        });
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user data');
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

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (mode === 'add' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
      const userData = {
        full_name: formData.full_name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: formData.role
      };

      // Only include password if it's provided
      if (formData.password) {
        userData.password = formData.password;
      }

      if (mode === 'add') {
        await userApi.add(userData);
      } else {
        await userApi.update(id, userData);
      }

      navigate('/admin/users');
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.message || 'Failed to save user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form field definitions
  const basicInfoFields = [
    {
      name: 'full_name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter username',
      required: true
    }
  ];

  const contactFields = [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
      fullWidth: true
    }
  ];

  const securityFields = [
    {
      name: 'role',
      label: 'User Role',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Select role' },
        { value: 'Super Admin', label: 'Super Admin' },
        { value: 'Project Manager', label: 'Project Manager' },
        { value: 'Finance Admin', label: 'Finance Admin' }
      ]
    },
    {
      name: 'password',
      label: mode === 'edit' ? 'New Password (leave blank to keep current)' : 'Password',
      type: 'password',
      placeholder: mode === 'edit' ? 'Enter new password (optional)' : 'Enter password',
      required: mode === 'add',
      helpText: 'Password must be at least 8 characters long'
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
          title="User Not Found"
          message={error}
          onBack={() => navigate('/admin/users')}
          showBack={true}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <PageHeader
        title={mode === 'add' ? 'Add New User' : 'Edit User'}
        subtitle={mode === 'add' ? 'Create a new admin user account' : 'Update user information'}
        backPath="/admin/users"
        showUserInfo={true}
      />

      {/* Form */}
      <Form
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitText={mode === 'add' ? 'Create User' : 'Update User'}
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

        {/* Contact Information Section */}
        <FormSection
          title="Contact Information"
          fields={contactFields}
          formData={formData}
          onChange={handleInputChange}
          errors={errors}
          layout="single"
        />

        {/* Security & Access Section */}
        <FormSection
          title="Security & Access"
          fields={securityFields}
          formData={formData}
          onChange={handleInputChange}
          errors={errors}
          layout="grid"
        />
      </Form>
    </PageLayout>
  );
};

export default UserFormPage;
