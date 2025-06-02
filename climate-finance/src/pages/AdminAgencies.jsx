import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { agencies } from '../data/mock/adminData';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import AdminPageHeader from '../components/layouts/AdminPageHeader';
import AdminControlsCard from '../components/layouts/AdminControlsCard';
import AdminListItem from '../components/layouts/AdminListItem';
import AdminEmptyState from '../components/layouts/AdminEmptyState';
import { Building2 } from 'lucide-react';

const AdminAgencies = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [agencyList, setAgencyList] = useState(agencies);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDelete = async (agencyId) => {
    if (window.confirm('Are you sure you want to delete this agency?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAgencyList(prev => prev.filter(a => a.agency_id !== agencyId));
      } catch (error) {
        console.error('Error deleting agency:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const agencyTypes = ['All', 'Implementing', 'Executing', 'Accredited'];

  const filteredAgencies = agencyList.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || agency.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'Implementing':
        return 'bg-blue-100 text-blue-800';
      case 'Executing':
        return 'bg-green-100 text-green-800';
      case 'Accredited':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filters = [
    {
      value: filterType,
      onChange: setFilterType,
      options: agencyTypes.map(type => ({
        value: type,
        label: type === 'All' ? 'All Types' : type
      }))
    }
  ];

  return (
    <PageLayout bgColor="bg-gray-50">
      <AdminPageHeader 
        title="Agencies Management"
        subtitle="Manage implementing and executing agencies"
        onLogout={handleLogout}
      />

      <AdminControlsCard
        title="All Agencies"
        count={filteredAgencies.length}
        searchPlaceholder="Search agencies..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonText="Add Agency"
        onAddClick={() => navigate('/admin/agencies/add')}
        filters={filters}
      />

      <Card hover padding={true}>
        <div className="divide-y divide-gray-100">
          {filteredAgencies.map((agency, index) => (
            <AdminListItem
              key={agency.agency_id}
              id={agency.agency_id}
              icon={<Building2 size={20} className="text-purple-600" />}
              title={agency.name}
              badge={
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(agency.type)}`}>
                  {agency.type}
                </span>
              }
              dataFields={[
                { label: 'Agency ID', value: agency.agency_id },
                { label: 'Type', value: agency.type }
              ]}
              onEdit={(id) => navigate(`/admin/agencies/edit/${id}`)}
              onDelete={handleDelete}
              index={index}
            />
          ))}
        </div>
        
        {filteredAgencies.length === 0 && (
          <AdminEmptyState
            title="No agencies found"
            description="No agencies match your search criteria."
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default AdminAgencies;