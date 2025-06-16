import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckboxGroup from '../../components/ui/CheckboxGroup';
import RadioWithSliders from '../../components/ui/RadioWithSliders';
import PeopleAffectedDisplay from '../../components/ui/PeopleAffectedDisplay';

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
  const navigate = useNavigate();

  const handleAddAgency = () => {
    localStorage.setItem('projectFormData', JSON.stringify(formData));
    navigate('/admin/agencies/new');
  };

  const handleAddFundingSource = () => {
    localStorage.setItem('projectFormData', JSON.stringify(formData));
    navigate('/admin/funding-sources/new');
  };

  const handleAddLocation = () => {
    localStorage.setItem('projectFormData', JSON.stringify(formData));
    navigate('/admin/locations/new');
  };

  const handleAddFocalArea = () => {
    localStorage.setItem('projectFormData', JSON.stringify(formData));
    navigate('/admin/focal-areas/new');
  };

  // Get selected location objects for people affected calculation
  const selectedLocationObjects = formData.locations.map(locationId => 
    locations.find(loc => loc.location_id === locationId)
  ).filter(Boolean);

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
          getOptionSubtext={(agency) => agency.type}
          onAddNew={handleAddAgency}
          addButtonText="Add Agency"
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
          onAddNew={handleAddFundingSource}
          addButtonText="Add Funding Source"
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
          onAddNew={handleAddLocation}
          addButtonText="Add Location"
        />
        
        {/* People Affected Display */}
        {selectedLocationObjects.length > 0 && (
          <div className="mt-4">
            <PeopleAffectedDisplay 
              locations={selectedLocationObjects}
              impactPercentage={10}
              showDetails={true}
            />
          </div>
        )}
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
          onAddNew={handleAddFocalArea}
          addButtonText="Add Focal Area"
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