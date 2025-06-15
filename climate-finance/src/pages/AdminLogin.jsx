import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { ArrowLeft, Lock, User, Mail, Building, UserCog } from 'lucide-react';

const AdminLogin = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
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

    if (isLoginMode) {
      // Login validation
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
    } else {
      // Registration validation
      if (!formData.username || !formData.email || !formData.password || !formData.role || !formData.department) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        setIsLoading(false);
        return;
      }

      try {
        const userData = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          department: formData.department.trim(),
          active: true
        };

        const result = await register(userData);

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
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: '',
      department: ''
    });
    setError('');
  };

  const roleOptions = [
    { value: 'Super Admin', label: 'Super Admin' },
    { value: 'Project Manager', label: 'Project Manager' },
    { value: 'Finance Admin', label: 'Finance Admin' }
  ];

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
            {isLoginMode ? 'Sign in to your administrator account' : 'Create a new administrator account'}
          </p>
        </div>

        {/* Login/Register Form */}
        <Card padding="p-6" className="shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username/Email Field */}
              <Input
                label="Username or Email"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username or email"
                leftIcon={<User size={20} className="text-gray-400" />}
                required
                disabled={isLoading}
              />

              {/* Email Field - Only for registration */}
              {!isLoginMode && (
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  leftIcon={<Mail size={20} className="text-gray-400" />}
                  required
                  disabled={isLoading}
                />
              )}

              {/* Role Field - Only for registration */}
              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <UserCog size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select a role</option>
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Department Field - Only for registration */}
              {!isLoginMode && (
                <Input
                  label="Department"
                  name="department"
                  type="text"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter your department"
                  leftIcon={<Building size={20} className="text-gray-400" />}
                  required
                  disabled={isLoading}
                />
              )}

              {/* Password Field */}
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isLoginMode ? "Enter your password" : "Create a password (min. 8 characters)"}
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loading size="sm" />
                  <span className="ml-2">
                    {isLoginMode ? 'Signing in...' : 'Creating account...'}
                  </span>
                </div>
              ) : (
                isLoginMode ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              className="mt-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
              disabled={isLoading}
            >
              {isLoginMode ? 'Create new account' : 'Sign in instead'}
            </button>
          </div>
        </Card>

        {/* Help Text */}
        <Card padding="p-4" className="bg-primary-50 border border-primary-200">
          <div className="text-center">
            <p className="text-sm text-primary-700">
              {isLoginMode 
                ? "Need help accessing your account? Contact your system administrator."
                : "By creating an account, you agree to follow the organization's security policies."
              }
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;