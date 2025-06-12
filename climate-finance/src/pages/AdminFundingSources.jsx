import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fundingSources } from '../data/mock/adminData';
import { formatCurrency } from '../utils/formatters';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import AdminPageHeader from '../components/layouts/AdminPageHeader';
import AdminControlsCard from '../components/layouts/AdminControlsCard';
import AdminListItem from '../components/layouts/AdminListItem';
import AdminEmptyState from '../components/layouts/AdminEmptyState';
import { DollarSign } from 'lucide-react';

const AdminFundingSources = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sources, setSources] = useState(fundingSources);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDelete = async (sourceId) => {
    if (window.confirm('Are you sure you want to delete this funding source?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setSources(prev => prev.filter(s => s.funding_source_id !== sourceId));
      } catch (error) {
        console.error('Error deleting funding source:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredSources = sources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.dev_partner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout bgColor="bg-gray-50">
      <AdminPageHeader 
        title="Funding Sources Management"
        subtitle="Manage funding sources and development partners"
        onLogout={handleLogout}
      />

      <AdminControlsCard
        title="All Funding Sources"
        count={filteredSources.length}
        searchPlaceholder="Search funding sources..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonText="Add Funding Source"
        onAddClick={() => navigate('/admin/funding-sources/add')}
      />

      <Card hover padding={true}>
        <div className="divide-y divide-gray-100">
          {filteredSources.map((source, index) => (
            <AdminListItem
              key={source.funding_source_id}
              id={source.funding_source_id}
              icon={<DollarSign size={20} className="text-purple-600" />}
              title={source.name}
              subtitle={source.dev_partner}
              badge={source.non_grant_instrument && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                  {source.non_grant_instrument}
                </span>
              )}
              dataFields={[
                { label: 'Grant Amount', value: formatCurrency(source.grant_amount) },
                { label: 'Loan Amount', value: formatCurrency(source.loan_amount) },
                { label: 'Counterpart Funding', value: formatCurrency(source.counterpart_funding) }
              ]}
              onEdit={(id) => navigate(`/admin/funding-sources/${id}/edit`)}
              onDelete={handleDelete}
              index={index}
            />
          ))}
        </div>
        
        {filteredSources.length === 0 && (
          <AdminEmptyState
            title="No funding sources found"
            description="No funding sources match your search criteria."
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default AdminFundingSources;