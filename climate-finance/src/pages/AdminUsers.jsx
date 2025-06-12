import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminUsers } from '../data/mock/adminData';
import { formatDate } from '../utils/formatters';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import AdminPageHeader from '../components/layouts/AdminPageHeader';
import AdminControlsCard from '../components/layouts/AdminControlsCard';
import AdminListItem from '../components/layouts/AdminListItem';
import AdminEmptyState from '../components/layouts/AdminEmptyState';
import { User, UserCheck, UserX } from 'lucide-react';

const AdminUsers = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(adminUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDelete = async (userId) => {
    if (userId === user.id) {
      alert('You cannot delete your own account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setUsers(prev => prev.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleUserStatus = async (userId) => {
    if (userId === user.id) {
      alert('You cannot deactivate your own account');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    'Super Admin',
    'Project Manager',
    'Finance Admin',
    'Data Manager',
    'Viewer'
  ];

  const filteredUsers = users.filter(userItem => {
    const matchesSearch = userItem.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userItem.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userItem.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || userItem.role === filterRole;
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'active' && userItem.isActive) ||
                         (filterStatus === 'inactive' && !userItem.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-red-100 text-red-800';
      case 'Project Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Finance Admin':
        return 'bg-green-100 text-green-800';
      case 'Data Manager':
        return 'bg-yellow-100 text-yellow-800';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filters = [
    {
      value: filterRole,
      onChange: setFilterRole,
      options: ['All', ...roleOptions].map(role => ({
        value: role,
        label: role === 'All' ? 'All Roles' : role
      }))
    },
    {
      value: filterStatus,
      onChange: setFilterStatus,
      options: [
        { value: 'All', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];

  return (
    <PageLayout bgColor="bg-gray-50">
      <AdminPageHeader 
        title="User Management"
        subtitle="Manage admin users and permissions"
        onLogout={handleLogout}
      />

      <AdminControlsCard
        title="All Users"
        count={filteredUsers.length}
        searchPlaceholder="Search users..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonText="Add New Admin"
        onAddClick={() => navigate('/admin/users/add')}
        filters={filters}
      />

      <Card hover padding={true}>
        <div className="divide-y divide-gray-100">
          {filteredUsers.map((userItem, index) => (
            <AdminListItem
              key={userItem.id}
              id={userItem.id}
              icon={
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">
                    {userItem.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              }
              title={
                <div className="flex items-center gap-2">
                  <span>{userItem.fullName}</span>
                  {userItem.id === user.id && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      You
                    </span>
                  )}
                </div>
              }
              subtitle={`@${userItem.username} • ${userItem.email}`}
              badge={
                <div className="flex flex-col gap-1">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(userItem.role)}`}>
                    {userItem.role}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    userItem.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userItem.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              }
              dataFields={[
                { label: 'Department', value: userItem.department },
                { label: 'Last Login', value: userItem.lastLogin ? formatDate(userItem.lastLogin) : 'Never' }
              ]}
              onEdit={(id) => navigate(`/admin/users/${id}/edit`)}
              onDelete={handleDelete}
              customActions={[
                {
                  label: userItem.isActive ? 'Deactivate' : 'Activate',
                  icon: userItem.isActive ? <UserX size={14} /> : <UserCheck size={14} />,
                  onClick: () => toggleUserStatus(userItem.id),
                  disabled: userItem.id === user.id,
                  className: userItem.isActive 
                    ? "text-orange-600 border-orange-300 hover:bg-orange-50 hover:border-orange-400 hover:text-orange-700" 
                    : "text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400 hover:text-green-700"
                }
              ]}
              index={index}
              isInactive={!userItem.isActive}
            />
          ))}
        </div>
        
        {filteredUsers.length === 0 && (
          <AdminEmptyState
            title="No users found"
            description="No users match your search criteria."
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default AdminUsers;