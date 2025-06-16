import React from 'react';
import AdminFormPage from '../features/admin/AdminFormPage';
import { focalAreaApi } from '../services/api';

const FocalAreaFormPage = ({ mode = 'add' }) => {
  const fields = [
    {
      name: 'name',
      label: 'Focal Area Name',
      type: 'text',
      placeholder: 'Enter focal area name',
      required: true,
      helpText: 'Enter a descriptive name for the focal area or sector',
      className: 'col-span-full'
    }
  ];

  const defaultFormData = {
    name: ''
  };

  const validationRules = {
    name: {
      required: true,
      minLength: 2
    }
  };

  const transformSubmitData = (data) => ({
    name: data.name?.trim()
  });

  const transformLoadData = (data) => ({
    name: data.name || ''
  });

  return (
    <AdminFormPage
      title={mode === 'add' ? 'Add New Focal Area' : 'Edit Focal Area'}
      entityName="focal-area"
      apiService={focalAreaApi}
      fields={fields}
      defaultFormData={defaultFormData}
      mode={mode}
      validationRules={validationRules}
      transformSubmitData={transformSubmitData}
      transformLoadData={transformLoadData}
      backPath="/admin/focal-areas"
    />
  );
};

export default FocalAreaFormPage;