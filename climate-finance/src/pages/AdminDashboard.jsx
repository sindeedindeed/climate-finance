import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../components/layouts/PageLayout";
import PageHeader from "../components/layouts/PageHeader";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import Loading from "../components/ui/Loading";
import ErrorState from "../components/ui/ErrorState";
import { formatCurrency } from "../utils/formatters";
import { projectApi } from "../services/api";
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
    RefreshCw,
    Activity,
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
                console.log('Admin Dashboard data:', data);
                
                // Helper function to calculate percentage change
                const calculateChange = (current, previous) => {
                    const currentNum = parseFloat(current) || 0;
                    const previousNum = parseFloat(previous) || 0;
                    
                    if (previousNum === 0) {
                        return "No previous data available";
                    }
                    if (currentNum === 0 && previousNum === 0) {
                        return "No change from last year";
                    }
                    
                    const percentage = ((currentNum - previousNum) / previousNum) * 100;
                    return percentage >= 0
                        ? `+${percentage.toFixed(2)}% from last year`
                        : `${percentage.toFixed(2)}% from last year`;
                };
                
                setDashboardStats([
                    {
                        title: "Total Projects",
                        value: data.total_projects || 0,
                        change: data.previous_year?.total_projects !== undefined
                            ? calculateChange(
                                  data.current_year?.total_projects || 0,
                                  data.previous_year.total_projects || 0
                              )
                            : "Based on all-time data",
                        color: "primary",
                        icon: <FolderTree size={20} />,
                    },
                    {
                        title: "Active Projects",
                        value: data.active_projects || 0,
                        change: data.previous_year?.active_projects !== undefined
                            ? calculateChange(
                                  data.current_year?.active_projects || 0,
                                  data.previous_year.active_projects || 0
                              )
                            : "Based on all-time data",
                        color: "success",
                        icon: <Activity size={20} />,
                    },
                    {
                        title: "Total Climate Finance",
                        value: formatCurrency(data.total_climate_finance || 0),
                        change: data.previous_year?.total_climate_finance !== undefined
                            ? calculateChange(
                                  data.current_year?.total_climate_finance || 0,
                                  data.previous_year.total_climate_finance || 0
                              )
                            : "Based on all-time data",
                        color: "warning",
                        icon: <Banknote size={20} />,
                    },
                    {
                        title: "Adaptation Finance",
                        value: formatCurrency(data.adaptation_finance || 0),
                        change: data.previous_year?.adaptation_finance !== undefined
                            ? calculateChange(
                                  data.current_year?.adaptation_finance || 0,
                                  data.previous_year.adaptation_finance || 0
                              )
                            : "Based on all-time data",
                        color: "primary",
                        icon: <DollarSign size={20} />,
                    },
                ]);
            } else {
                throw new Error("Invalid response data");
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
                    color: "primary",
                    icon: <FolderTree size={20} />,
                },
                {
                    title: "Active Projects",
                    value: 0,
                    change: "No data available",
                    color: "success",
                    icon: <Activity size={20} />,
                },
                {
                    title: "Total Climate Finance",
                    value: formatCurrency(0),
                    change: "No data available",
                    color: "warning",
                    icon: <Banknote size={20} />,
                },
                {
                    title: "Adaptation Finance",
                    value: formatCurrency(0),
                    change: "No data available",
                    color: "primary",
                    icon: <DollarSign size={20} />,
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
            icon: <FolderTree size={20} />,
            path: "/admin/projects",
            color: "bg-primary-600",
        },
        {
            title: "User Management",
            description: "Manage admin users and permissions",
            icon: <Users size={20} />,
            path: "/admin/users",
            color: "bg-success-600",
        },
        {
            title: "Funding Sources",
            description: "Manage funding sources and partners",
            icon: <DollarSign size={20} />,
            path: "/admin/funding-sources",
            color: "bg-warning-600",
        },
        {
            title: "Agencies",
            description: "Manage implementing agencies",
            icon: <Building2 size={20} />,
            path: "/admin/agencies",
            color: "bg-primary-500",
        },
        {
            title: "Locations",
            description: "Manage project locations",
            icon: <MapPin size={20} />,
            path: "/admin/locations",
            color: "bg-success-500",
        },
        {
            title: "Focal Areas",
            description: "Manage project focal areas",
            icon: <Target size={20} />,
            path: "/admin/focal-areas",
            color: "bg-warning-500",
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
                subtitle={`Welcome back, ${
                    user?.fullName || user?.full_name || "Admin"
                }`}
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

            {/* Dashboard Stats - Now using consistent StatCard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardStats.map((stat, index) => (
                    <div
                        key={index}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <StatCard
                            title={stat.title}
                            value={stat.value}
                            change={stat.change}
                            color={stat.color}
                            icon={stat.icon}
                        />
                    </div>
                ))}
            </div>

            {/* Quick Actions Menu */}
            <Card padding="p-4 sm:p-6" className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="group flex items-center p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 hover:shadow-medium"
                        >
                            <div
                                className={`p-3 rounded-xl ${item.color} group-hover:scale-105 transition-transform duration-200`}
                            >
                                {item.icon}
                            </div>
                            <div className="ml-4">
                                <div className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                                    {item.title}
                                </div>
                                <p className="text-sm text-gray-600">
                                    {item.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </Card>

            {/* Recent Activity */}
            <Card padding="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Recent Activity
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center p-4 bg-primary-50 rounded-xl border border-primary-100 hover:bg-primary-100 transition-colors duration-200">
                        <div className="p-2 bg-primary-100 rounded-full">
                            <Plus className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                                New project added
                            </p>
                            <p className="text-xs text-gray-600">
                                Climate Resilient Coastal Protection Project
                            </p>
                        </div>
                        <div className="text-xs text-gray-500">2 hours ago</div>
                    </div>

                    <div className="flex items-center p-4 bg-success-50 rounded-xl border border-success-100 hover:bg-success-100 transition-colors duration-200">
                        <div className="p-2 bg-success-100 rounded-full">
                            <User className="w-4 h-4 text-success-600" />
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                                Admin user updated
                            </p>
                            <p className="text-xs text-gray-600">
                                Project Manager permissions modified
                            </p>
                        </div>
                        <div className="text-xs text-gray-500">1 day ago</div>
                    </div>

                    <div className="flex items-center p-4 bg-warning-50 rounded-xl border border-warning-100 hover:bg-warning-100 transition-colors duration-200">
                        <div className="p-2 bg-warning-100 rounded-full">
                            <DollarSign className="w-4 h-4 text-warning-600" />
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                                Funding source updated
                            </p>
                            <p className="text-xs text-gray-600">
                                World Bank funding allocation modified
                            </p>
                        </div>
                        <div className="text-xs text-gray-500">2 days ago</div>
                    </div>

                    <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                                New agency registered
                            </p>
                            <p className="text-xs text-gray-600">
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
