import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { focalAreas } from '../data/mock/adminData';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import AdminPageHeader from '../components/layouts/AdminPageHeader';
import AdminControlsCard from '../components/layouts/AdminControlsCard';
import AdminListItem from '../components/layouts/AdminListItem';
import AdminEmptyState from '../components/layouts/AdminEmptyState';
import { Target } from 'lucide-react';

const AdminFocalAreas = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [focalAreaList, setFocalAreaList] = useState(focalAreas);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDelete = async (focalAreaId) => {
    if (window.confirm('Are you sure you want to delete this focal area?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setFocalAreaList(prev => prev.filter(f => f.focal_area_id !== focalAreaId));
      } catch (error) {
        console.error('Error deleting focal area:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredFocalAreas = focalAreaList.filter(focalArea => {
    const matchesSearch = focalArea.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getFocalAreaColor = (name) => {
    if (name.includes('Adaptation')) return 'bg-blue-100 text-blue-800';
    if (name.includes('Mitigation')) return 'bg-green-100 text-green-800';
    if (name.includes('Energy')) return 'bg-yellow-100 text-yellow-800';
    if (name.includes('Agriculture')) return 'bg-orange-100 text-orange-800';
    if (name.includes('Forest')) return 'bg-emerald-100 text-emerald-800';
    if (name.includes('Water')) return 'bg-cyan-100 text-cyan-800';
    if (name.includes('Disaster')) return 'bg-red-100 text-red-800';
    return 'bg-purple-100 text-purple-800';
  };

  return (
    <PageLayout bgColor="bg-gray-50">
      <AdminPageHeader 
        title="Focal Areas Management"
        subtitle="Manage climate project focal areas and sectors"
        onLogout={handleLogout}
      />

      <AdminControlsCard
        title="All Focal Areas"
        count={filteredFocalAreas.length}
        searchPlaceholder="Search focal areas..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonText="Add Focal Area"
        onAddClick={() => navigate('/admin/focal-areas/add')}
      />

      <Card hover padding={true}>
        <div className="divide-y divide-gray-100">
          {filteredFocalAreas.map((focalArea, index) => (
            <AdminListItem
              key={focalArea.focal_area_id}
              id={focalArea.focal_area_id}
              icon={<Target size={20} className="text-purple-600" />}
              title={focalArea.name}
              badge={
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getFocalAreaColor(focalArea.name)}`}>
                  {focalArea.name.includes('Adaptation') ? 'Adaptation' : 
                   focalArea.name.includes('Mitigation') ? 'Mitigation' : 'Other'}
                </span>
              }
              dataFields={[
                { label: 'Focal Area ID', value: focalArea.focal_area_id }
              ]}
              onEdit={(id) => navigate(`/admin/focal-areas/${id}/edit`)}
              onDelete={handleDelete}
              index={index}
            />
          ))}
        </div>
        
        {filteredFocalAreas.length === 0 && (
          <AdminEmptyState
            title="No focal areas found"
            description="No focal areas match your search criteria."
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default AdminFocalAreas;