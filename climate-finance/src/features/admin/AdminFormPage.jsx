import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layouts/PageLayout';
import Form from '../../components/ui/Form';
import FormField from '../../components/ui/FormField';
import ErrorState from '../../components/ui/ErrorState';
import Loading from '../../components/ui/Loading';
import { useAuth } from '../../context/AuthContext';

const AdminFormPage = ({
  title,
  entityName,
  apiService,
  fields,
  defaultFormData = {},
  mode = 'add', // 'add' | 'edit'
  validationRules = {},
  onSuccess = null,
  transformSubmitData = (data) => data,
  transformLoadData = (data) => data
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  const isEditMode = mode === 'edit' && id;
  const backPath = `/admin/${entityName}s`;

  // Fetch data for edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchData();
    }
  }, [id, isEditMode]);

  const fetchData = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const response = await apiService.getById(id);
      const data = response.data || response;
      setFormData(transformLoadData(data));
    } catch (err) {
      setError(err.message || `Failed to fetch ${entityName}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMultiSelectChange = (name, selectedValues) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedValues
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.entries(validationRules).forEach(([fieldName, rules]) => {
      const value = formData[fieldName];
      
      if (rules.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[fieldName] = `${fieldName.replace(/_/g, ' ')} is required`;
      }
      
      if (rules.minLength && value && value.length < rules.minLength) {
        newErrors[fieldName] = `${fieldName.replace(/_/g, ' ')} must be at least ${rules.minLength} characters`;
      }
      
      if (rules.email && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[fieldName] = 'Please enter a valid email address';
      }
      
      if (rules.custom && value) {
        const customError = rules.custom(value, formData);
        if (customError) {
          newErrors[fieldName] = customError;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      
      const submitData = transformSubmitData(formData);
      
      if (isEditMode) {
        await apiService.update(id, submitData);
      } else {
        await apiService.create(submitData);
      }
      
      if (onSuccess) {
        onSuccess(submitData, isEditMode);
      } else {
        navigate(backPath);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ submit: err.message || `Failed to ${isEditMode ? 'update' : 'create'} ${entityName}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(backPath);
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

  if (error && isEditMode) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <ErrorState
          title={`${entityName.charAt(0).toUpperCase() + entityName.slice(1)} Not Found`}
          message={error}
          onBack={() => navigate(backPath)}
          showBack={true}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      <Form
        title={`${isEditMode ? 'Edit' : 'Add'} ${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`}
        subtitle={isEditMode ? `Update ${entityName} information` : `Add a new ${entityName} to the system`}
        backPath={backPath}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        submitText={isEditMode ? 'Update' : 'Create'}
        layout="grid"
      >
        {/* Form Fields */}
        {fields.map((field) => {
          if (field.type === 'custom') {
            return (
              <div key={field.name} className={field.className}>
                {field.render(formData, handleInputChange, handleMultiSelectChange, errors)}
              </div>
            );
          }

          return (
            <FormField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type || 'text'}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              error={errors[field.name]}
              required={field.required}
              placeholder={field.placeholder}
              options={field.options}
              multiple={field.multiple}
              rows={field.rows}
              disabled={field.disabled}
              helpText={field.helpText}
              className={field.className}
            />
          );
        })}

        {/* Submit Error */}
        {errors.submit && (
          <div className="col-span-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          </div>
        )}
      </Form>
    </PageLayout>
  );
};

export default AdminFormPage;