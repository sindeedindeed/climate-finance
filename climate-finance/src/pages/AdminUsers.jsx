import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { adminUsers } from '../data/mock/adminData';
import { formatDate } from '../utils/formatters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
import { ArrowLeft, Search, Edit, Trash2, Plus, UserCheck, UserX } from 'lucide-react';

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

  return (
    <PageLayout bgColor="bg-gray-50">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard" className="text-purple-600 hover:text-purple-700 transition-colors duration-200">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            <p className="text-gray-500">Manage admin users and permissions</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>

      <Card hover className="mb-6" padding={true}>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              All Users ({filteredUsers.length})
            </h3>
            
            <Button 
              onClick={() => navigate('/admin/users/add')} 
              variant="primary"
              leftIcon={<Plus size={16} />}
              className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 mt-4 md:mt-0"
            >
              Add New Admin
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="border border-gray-300 rounded-xl text-sm py-2.5 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="All">All Roles</option>
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              
              <select
                className="border border-gray-300 rounded-xl text-sm py-2.5 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <Card hover padding={true}>
        <div className="divide-y divide-gray-100">
          {filteredUsers.map((userItem, index) => (
            <div 
              key={userItem.id} 
              className={`p-6 hover:bg-purple-50 transition-all duration-200 group animate-fade-in-up ${!userItem.isActive ? 'opacity-60' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                <div className="flex items-center flex-shrink-0">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <span className="text-sm font-medium text-purple-600">
                        {userItem.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <div className="text-lg font-medium text-gray-900 group-hover:text-purple-600 transition-colors flex items-center flex-wrap gap-2">
                      <span className="truncate">{userItem.fullName}</span>
                      {userItem.id === user.id && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 flex-shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate">@{userItem.username}</div>
                    <div className="text-sm text-gray-500 truncate">{userItem.email}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 flex-grow min-w-0">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">Role</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{userItem.role}</p>
                  </div>
                  
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">Department</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{userItem.department}</p>
                  </div>
                  
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      userItem.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {userItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">Last Login</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userItem.lastLogin ? formatDate(userItem.lastLogin) : 'Never'}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <Button
                    onClick={() => navigate(`/admin/users/edit/${userItem.id}`)}
                    size="sm"
                    variant="outline"
                    leftIcon={<Edit size={14} />}
                    className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-200"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => toggleUserStatus(userItem.id)}
                    size="sm"
                    variant="outline"
                    leftIcon={userItem.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                    className={userItem.isActive 
                      ? "text-orange-600 border-orange-300 hover:bg-orange-50 hover:border-orange-400 hover:text-orange-700" 
                      : "text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400 hover:text-green-700"
                    }
                    disabled={userItem.id === user.id}
                  >
                    {userItem.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    onClick={() => handleDelete(userItem.id)}
                    size="sm"
                    variant="outline"
                    leftIcon={<Trash2 size={14} />}
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-all duration-200"
                    disabled={userItem.id === user.id}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-4">
              No users match your search criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </Card>
    </PageLayout>
  );
};

export default AdminUsers;