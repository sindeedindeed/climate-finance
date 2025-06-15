import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../components/layouts/PageLayout";
import PageHeader from "../components/layouts/PageHeader";
import Card from "../components/ui/Card";
import Loading from "../components/ui/Loading";
import ErrorState from "../components/ui/ErrorState";
import { formatCurrency } from '../utils/formatters';
import { projectApi } from '../services/api';
import {
  Users,
  FolderTree,
  DollarSign,
  Building2,
  MapPin,
  Target,
  Plus,
  User,
  Banknote,
  RefreshCw
} from "lucide-react";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await projectApi.getDashboardOverviewStats();

      if (response.status && response.data) {
        const data = response.data;
        setDashboardStats([
          {
            title: "Total Projects",
            value: data.total_projects || 0,
            change: "+2 this month",
            color: "bg-purple-500",
          },
          {
            title: "Active Projects",
            value: data.active_projects || 0,
            change: "+1 this month",
            color: "bg-purple-600",
          },
          {
            title: "Total Climate Finance",
            value: data.total_climate_finance || 0,
            change: "+15% this year",
            color: "bg-purple-700",
          },
          {
            title: "Adaptation Finance",
            value: data.adaptation_finance || 0,
            change: "+12% this year",
            color: "bg-purple-400",
          },
        ]);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to load dashboard statistics");
      // Fallback to default values
      setDashboardStats([
        {
          title: "Total Projects",
          value: 0,
          change: "No data available",
          color: "bg-purple-500",
        },
        {
          title: "Active Projects",
          value: 0,
          change: "No data available",
          color: "bg-purple-600",
        },
        {
          title: "Total Climate Finance",
          value: 0,
          change: "No data available",
          color: "bg-purple-700",
        },
        {
          title: "Adaptation Finance",
          value: 0,
          change: "No data available",
          color: "bg-purple-400",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      title: "Project Management",
      description: "Add, edit, and manage climate projects",
      icon: <FolderTree size={20} className="text-white" />,
      path: "/admin/projects",
      color: "bg-purple-500",
    },
    {
      title: "User Management",
      description: "Manage admin users and permissions",
      icon: <Users size={20} className="text-white" />,
      path: "/admin/users",
      color: "bg-purple-600",
    },
    {
      title: "Funding Sources",
      description: "Manage funding sources and partners",
      icon: <DollarSign size={20} className="text-white" />,
      path: "/admin/funding-sources",
      color: "bg-purple-700",
    },
    {
      title: "Agencies",
      description: "Manage implementing agencies",
      icon: <Building2 size={20} className="text-white" />,
      path: "/admin/agencies",
      color: "bg-purple-400",
    },
    {
      title: "Locations",
      description: "Manage project locations",
      icon: <MapPin size={20} className="text-white" />,
      path: "/admin/locations",
      color: "bg-purple-500",
    },
    {
      title: "Focal Areas",
      description: "Manage project focal areas",
      icon: <Target size={20} className="text-white" />,
      path: "/admin/focal-areas",
      color: "bg-purple-600",
    },
  ];

  if (isLoading) {
    return (
      <PageLayout bgColor="bg-gray-50">
        <div className="flex justify-center items-center min-h-64">
          <Loading size="lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout bgColor="bg-gray-50">
      {/* Page Header - Using reusable component */}
      <PageHeader
        title="Climate Finance Admin Portal"
        subtitle={`Welcome back, ${user?.fullName || user?.full_name || 'Admin'}`}
        backPath="/"
        backText="Back to Main Site"
        showUserInfo={true}
        showLogout={true}
        onLogout={handleLogout}
      />

      {error && (
        <ErrorState
          title="Dashboard Error"
          message={error}
          onRefresh={fetchDashboardStats}
          showRefresh={true}
          className="mb-6"
        />
      )}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <Card key={index} hover padding={true} className="group">
            <div className="flex items-center">
              <div
                className={`p-3 rounded-xl ${stat.color} group-hover:scale-105 transition-transform duration-200`}
              >
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
                    {typeof stat.value === "number" &&
                    stat.title.includes("Finance")
                      ? formatCurrency(stat.value)
                      : stat.value}
                  </dd>
                  <dd className="text-sm text-gray-500">{stat.change}</dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions Menu */}
      <Card hover padding={true} className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="group flex items-center p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <div
                className={`p-3 rounded-xl ${item.color} group-hover:scale-105 transition-transform duration-200`}
              >
                {item.icon}
              </div>
              <div className="ml-4">
                <div className="font-medium text-gray-900 group-hover:text-purple-700">
                  {item.title}
                </div>
                <p className="text-sm text-gray-500">{item.description}</p>
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
              <p className="text-sm font-medium text-gray-900">
                New project added
              </p>
              <p className="text-xs text-gray-500">
                Climate Resilient Coastal Protection Project
              </p>
            </div>
            <div className="text-xs text-gray-500">2 hours ago</div>
          </div>

          <div className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200">
            <div className="p-2 bg-green-100 rounded-full">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Admin user updated
              </p>
              <p className="text-xs text-gray-500">
                Project Manager permissions modified
              </p>
            </div>
            <div className="text-xs text-gray-500">1 day ago</div>
          </div>

          <div className="flex items-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors duration-200">
            <div className="p-2 bg-yellow-100 rounded-full">
              <DollarSign className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Funding source updated
              </p>
              <p className="text-xs text-gray-500">
                World Bank funding allocation modified
              </p>
            </div>
            <div className="text-xs text-gray-500">2 days ago</div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200">
            <div className="p-2 bg-blue-100 rounded-full">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">
                New agency registered
              </p>
              <p className="text-xs text-gray-500">
                Department of Environment added
              </p>
            </div>
            <div className="text-xs text-gray-500">3 days ago</div>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
};

export default AdminDashboard;
