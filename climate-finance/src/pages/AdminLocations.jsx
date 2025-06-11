import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { locations } from '../data/mock/adminData';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import AdminPageHeader from '../components/layouts/AdminPageHeader';
import AdminControlsCard from '../components/layouts/AdminControlsCard';
import AdminListItem from '../components/layouts/AdminListItem';
import AdminEmptyState from '../components/layouts/AdminEmptyState';
import { MapPin } from 'lucide-react';

const AdminLocations = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [locationList, setLocationList] = useState(locations);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDelete = async (locationId) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setLocationList(prev => prev.filter(l => l.location_id !== locationId));
      } catch (error) {
        console.error('Error deleting location:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const regions = ['All', ...new Set(locations.map(loc => loc.region))];

  const filteredLocations = locationList.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'All' || location.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  const getRegionColor = (region) => {
    switch (region) {
      case 'Central': return 'bg-blue-100 text-blue-800';
      case 'Northeast': return 'bg-green-100 text-green-800';
      case 'Northwest': return 'bg-yellow-100 text-yellow-800';
      case 'Southwest': return 'bg-purple-100 text-purple-800';
      case 'South': return 'bg-red-100 text-red-800';
      case 'Southeast': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filters = [
    {
      value: filterRegion,
      onChange: setFilterRegion,
      options: regions.map(region => ({
        value: region,
        label: region === 'All' ? 'All Regions' : region
      }))
    }
  ];

  return (
    <PageLayout bgColor="bg-gray-50">
      <AdminPageHeader 
        title="Locations Management"
        subtitle="Manage project locations and regions"
        onLogout={handleLogout}
      />

      <AdminControlsCard
        title="All Locations"
        count={filteredLocations.length}
        searchPlaceholder="Search locations..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonText="Add Location"
        onAddClick={() => navigate('/admin/locations/add')}
        filters={filters}
      />

      <Card hover padding={true}>
        <div className="divide-y divide-gray-100">
          {filteredLocations.map((location, index) => (
            <AdminListItem
              key={location.location_id}
              id={location.location_id}
              icon={<MapPin size={20} className="text-purple-600" />}
              title={location.name}
              badge={
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRegionColor(location.region)}`}>
                  {location.region}
                </span>
              }
              dataFields={[
                { label: 'Location ID', value: location.location_id }
              ]}
              onEdit={(id) => navigate(`/admin/locations/edit/${id}`)}
              onDelete={handleDelete}
              index={index}
            />
          ))}
        </div>
        
        {filteredLocations.length === 0 && (
          <AdminEmptyState
            title="No locations found"
            description="No locations match your search criteria."
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default AdminLocations;