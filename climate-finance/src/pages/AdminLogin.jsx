import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { ArrowLeft, Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Demo credentials
  const demoCredentials = {
    email: "demo@climatedb.com",
    username: "demo_user",
    password: "Demo123!"
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleDemoLogin = () => {
    setFormData({
      username: demoCredentials.email,
      password: demoCredentials.password
    });
    setError('');
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
            className="flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200 text-sm font-medium"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span>Back to Main Site</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Portal
          </h2>
          <p className="text-gray-600 text-sm">
            Sign in to your administrator account
          </p>
        </div>

        {/* Login Form */}
        <Card padding="p-6" className="shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username/Email Field */}
              <Input
                label="Email or Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your email or username"
                leftIcon={<User size={20} className="text-gray-400" />}
                required
                disabled={isLoading}
              />

              {/* Password Field */}
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
              variant="primary"
              className="w-full py-3"
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

        {/* Help Text */}
        <Card padding="p-4" className="bg-primary-50 border border-primary-200">
          <div className="text-center">
            <p className="text-sm text-primary-700">
              Don't have an account? Contact your system administrator to get access to the admin portal.
            </p>
          </div>
        </Card>

        {/* Demo Credentials - Small Tooltip */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            Demo credentials: <span className="font-mono text-gray-600">demo@climatedb.com</span> / <span className="font-mono text-gray-600">Demo123!</span>
          </p>
          <button
            onClick={handleDemoLogin}
            className="text-xs text-blue-600 hover:text-blue-700 underline transition-colors"
          >
            Fill demo credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;