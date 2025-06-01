import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { adminDashboardStats } from '../data/mock/adminData';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/ui/Button';
import { ArrowLeft, FolderTree, Users, DollarSign, Building2, MapPin, Target, Plus, User, Banknote } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      title: 'Project Management',
      description: 'Add, edit, and manage climate projects',
      icon: <FolderTree size={20} className="text-white" />,
      path: '/admin/projects',
      color: 'bg-primary-500'
    },
    {
      title: 'User Management',
      description: 'Manage admin users and permissions',
      icon: <Users size={20} className="text-white" />,
      path: '/admin/users',
      color: 'bg-primary-600'
    },
    {
      title: 'Funding Sources',
      description: 'Manage funding sources and partners',
      icon: <DollarSign size={20} className="text-white" />,
      path: '/admin/funding-sources',
      color: 'bg-primary-700'
    },
    {
      title: 'Agencies',
      description: 'Manage implementing agencies',
      icon: <Building2 size={20} className="text-white" />,
      path: '/admin/agencies',
      color: 'bg-primary-400'
    },
    {
      title: 'Locations',
      description: 'Manage project locations',
      icon: <MapPin size={20} className="text-white" />,
      path: '/admin/locations',
      color: 'bg-primary-500'
    },
    {
      title: 'Focal Areas',
      description: 'Manage project focal areas',
      icon: <Target size={20} className="text-white" />,
      path: '/admin/focal-areas',
      color: 'bg-primary-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center text-gray-600 hover:text-primary-700 transition-colors duration-200"
                title="Back to Main Site"
              >
                <ArrowLeft size={20} />
                <span className="ml-2 text-sm">Back to Main Site</span>
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Climate Finance Admin Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.fullName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminDashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-md ${
                  index === 0 ? 'bg-primary-500' :
                  index === 1 ? 'bg-primary-600' :
                  index === 2 ? 'bg-primary-700' :
                  'bg-primary-400'
                }`}>
                  <div className="w-6 h-6 text-white">
                    {index === 0 && <FolderTree size={24} />}
                    {index === 1 && <Users size={24} />}
                    {index === 2 && <Banknote size={24} />}
                    {index === 3 && <Target size={24} />}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {typeof stat.value === 'number' && stat.title.includes('Budget') 
                        ? formatCurrency(stat.value)
                        : stat.value
                      }
                    </dd>
                    <dd className="text-sm text-gray-500">
                      {stat.change}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Menu */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="block p-6 bg-gray-50 rounded-lg border-2 border-transparent hover:border-primary-300 hover:bg-primary-50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-primary-50 rounded-lg">
                <div className="p-2 bg-primary-100 rounded-full">
                  <Plus className="w-4 h-4 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">New project added</p>
                  <p className="text-xs text-gray-500">Climate Resilient Coastal Protection Project</p>
                </div>
                <div className="ml-auto text-xs text-gray-500">2 hours ago</div>
              </div>
              
              <div className="flex items-center p-4 bg-success-50 rounded-lg">
                <div className="p-2 bg-success-100 rounded-full">
                  <User className="w-4 h-4 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Admin user updated</p>
                  <p className="text-xs text-gray-500">Project Manager permissions modified</p>
                </div>
                <div className="ml-auto text-xs text-gray-500">1 day ago</div>
              </div>
              
              <div className="flex items-center p-4 bg-warning-50 rounded-lg">
                <div className="p-2 bg-warning-100 rounded-full">
                  <DollarSign className="w-4 h-4 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Funding source added</p>
                  <p className="text-xs text-gray-500">New partnership with World Bank</p>
                </div>
                <div className="ml-auto text-xs text-gray-500">3 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;