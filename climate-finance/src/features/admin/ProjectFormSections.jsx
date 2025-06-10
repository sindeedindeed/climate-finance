import React from 'react';
import CheckboxGroup from '../../components/ui/CheckboxGroup';
import RadioWithSliders from '../../components/ui/RadioWithSliders';

const ProjectFormSections = ({
  formData,
  handleInputChange,
  handleMultiSelectChange,
  handleWashComponentChange,
  agencies,
  fundingSources,
  locations,
  focalAreas
}) => {
  return (
    <>
      {/* Agencies */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Implementing & Executing Agencies</h3>
        <CheckboxGroup
          label="Select Agencies"
          options={agencies}
          selectedValues={formData.agencies}
          onChange={(values) => handleMultiSelectChange({ target: { value: values } }, 'agencies')}
          getOptionId={(agency) => agency.agency_id}
          getOptionLabel={(agency) => agency.name}
          getOptionSubtext={(agency) => `${agency.type}`}
        />
      </div>

      {/* Funding Sources */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Funding Sources</h3>
        <CheckboxGroup
          label="Select Funding Sources"
          options={fundingSources}
          selectedValues={formData.funding_sources}
          onChange={(values) => handleMultiSelectChange({ target: { value: values } }, 'funding_sources')}
          getOptionId={(source) => source.funding_source_id}
          getOptionLabel={(source) => source.name}
          getOptionSubtext={(source) => `Development Partner: ${source.dev_partner}`}
        />
      </div>

      {/* Locations */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Locations</h3>
        <CheckboxGroup
          label="Select Locations"
          options={locations}
          selectedValues={formData.locations}
          onChange={(values) => handleMultiSelectChange({ target: { value: values } }, 'locations')}
          getOptionId={(location) => location.location_id}
          getOptionLabel={(location) => location.name}
          getOptionSubtext={(location) => `Region: ${location.region}`}
        />
      </div>

      {/* Focal Areas */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Focal Areas</h3>
        <CheckboxGroup
          label="Select Focal Areas"
          options={focalAreas}
          selectedValues={formData.focal_areas}
          onChange={(values) => handleMultiSelectChange({ target: { value: values } }, 'focal_areas')}
          getOptionId={(area) => area.focal_area_id}
          getOptionLabel={(area) => area.name}
        />
      </div>

      {/* WASH Component */}
      <div>
        <RadioWithSliders
          label="WASH Component"
          value={formData.wash_component}
          onChange={handleWashComponentChange}
          sliderConfigs={[
            { key: 'water_supply_percent', label: 'Water Supply' },
            { key: 'sanitation_percent', label: 'Sanitation' },
            { key: 'public_admin_percent', label: 'Public Administration' }
          ]}
        />
      </div>
    </>
  );
};

export default ProjectFormSections;