import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { ArrowLeft, Shield, Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div>
          <Link
            to="/"
            className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200 text-sm font-medium"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span>Back to Main Site</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200">
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Portal
          </h2>
          <p className="text-gray-600 text-sm">
            Sign in to your administrator account
          </p>
        </div>

        {/* Login Form */}
        <Card padding={true} className="shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username Field - Using reusable Input component */}
              <Input
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                leftIcon={<User size={20} className="text-gray-400" />}
                required
                disabled={isLoading}
              />

              {/* Password Field - Using reusable Input component */}
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                leftIcon={<Lock size={20} className="text-gray-400" />}
                showPasswordToggle
                required
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loading size="sm" />
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials */}
        <Card padding={true} className="bg-white border border-gray-200">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Demo Credentials:</h3>
            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between items-center">
                <span className="font-medium">Super Admin:</span>
                <code className="bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200 font-mono">
                  admin@climateFinance.gov.bd / admin123
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Project Manager:</span>
                <code className="bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200 font-mono">
                  pm@climateFinance.gov.bd / pm123
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Finance Admin:</span>
                <code className="bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200 font-mono">
                  finance@climateFinance.gov.bd / finance123
                </code>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;