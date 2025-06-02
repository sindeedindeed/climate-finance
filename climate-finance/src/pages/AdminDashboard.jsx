import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { adminDashboardStats } from '../data/mock/adminData';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageLayout from '../components/layouts/PageLayout';
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
      color: 'bg-purple-500'
    },
    {
      title: 'User Management',
      description: 'Manage admin users and permissions',
      icon: <Users size={20} className="text-white" />,
      path: '/admin/users',
      color: 'bg-purple-600'
    },
    {
      title: 'Funding Sources',
      description: 'Manage funding sources and partners',
      icon: <DollarSign size={20} className="text-white" />,
      path: '/admin/funding-sources',
      color: 'bg-purple-700'
    },
    {
      title: 'Agencies',
      description: 'Manage implementing agencies',
      icon: <Building2 size={20} className="text-white" />,
      path: '/admin/agencies',
      color: 'bg-purple-400'
    },
    {
      title: 'Locations',
      description: 'Manage project locations',
      icon: <MapPin size={20} className="text-white" />,
      path: '/admin/locations',
      color: 'bg-purple-500'
    },
    {
      title: 'Focal Areas',
      description: 'Manage project focal areas',
      icon: <Target size={20} className="text-white" />,
      path: '/admin/focal-areas',
      color: 'bg-purple-600'
    }
  ];

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-purple-600 hover:text-purple-700 transition-colors duration-200">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Climate Finance Admin Portal</h2>
            <p className="text-gray-500">Welcome back, {user?.fullName}</p>
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

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminDashboardStats.map((stat, index) => (
          <Card key={index} hover padding={true} className="group">
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                index === 0 ? 'bg-purple-500' :
                index === 1 ? 'bg-purple-600' :
                index === 2 ? 'bg-purple-700' :
                'bg-purple-400'
              } group-hover:scale-105 transition-transform duration-200`}>
                <div className="w-6 h-6 text-white">
                  {index === 0 && <FolderTree size={24} />}
                  {index === 1 && <Building2 size={24} />}
                  {index === 2 && <Banknote size={24} />}
                  {index === 3 && <DollarSign size={24} />}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
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
          </Card>
        ))}
      </div>

      {/* Quick Actions Menu */}
      <Card hover className="mb-8" padding={true}>
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="block p-6 bg-gray-50 rounded-xl border-2 border-transparent hover:border-purple-300 hover:bg-purple-50 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${item.color} group-hover:scale-105 transition-transform duration-200`}>
                  {item.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
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
      </Card>

      {/* Recent Activity */}
      <Card hover padding={true}>
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200">
            <div className="p-2 bg-purple-100 rounded-full">
              <Plus className="w-4 h-4 text-purple-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">New project added</p>
              <p className="text-xs text-gray-500">Climate Resilient Coastal Protection Project</p>
            </div>
            <div className="text-xs text-gray-500">2 hours ago</div>
          </div>
          
          <div className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200">
            <div className="p-2 bg-green-100 rounded-full">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">Admin user updated</p>
              <p className="text-xs text-gray-500">Project Manager permissions modified</p>
            </div>
            <div className="text-xs text-gray-500">1 day ago</div>
          </div>
          
          <div className="flex items-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors duration-200">
            <div className="p-2 bg-yellow-100 rounded-full">
              <DollarSign className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">Funding source added</p>
              <p className="text-xs text-gray-500">New partnership with World Bank</p>
            </div>
            <div className="text-xs text-gray-500">3 days ago</div>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
};

export default AdminDashboard;