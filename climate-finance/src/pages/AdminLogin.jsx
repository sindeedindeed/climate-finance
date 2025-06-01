import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const customStyles = {
    container: {
      minHeight: '100vh',
      background: '#F9F8FC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      color: '#7C65C1',
      textDecoration: 'none',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'color 0.2s ease'
    },
    iconContainer: {
      width: '4rem',
      height: '4rem',
      background: 'linear-gradient(135deg, #AB96E3 0%, #4D318C 100%)',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      boxShadow: '0 0 20px rgba(124, 101, 193, 0.3)'
    },
    formContainer: {
      background: '#ffffff',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      boxShadow: '0 4px 25px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #F3F4F6'
    },
    input: {
      width: '100%',
      padding: '0.625rem 0.75rem 0.625rem 2.5rem',
      border: '1px solid #D1D5DB',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#7C65C1',
      boxShadow: '0 0 0 2px rgba(124, 101, 193, 0.2)'
    },
    loginButton: {
      width: '100%',
      padding: '0.625rem 1rem',
      background: 'linear-gradient(135deg, #7C65C1 0%, #4D318C 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    loginButtonHover: {
      background: 'linear-gradient(135deg, #4D318C 0%, #3F1D85 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(124, 101, 193, 0.4)'
    },
    errorMessage: {
      background: '#FEF2F2',
      border: '1px solid #FEE2E2',
      borderRadius: '0.5rem',
      padding: '0.75rem',
      color: '#DC2626',
      fontSize: '0.875rem',
      marginTop: '1rem'
    },
    demoCredentials: {
      background: '#ffffff',
      borderRadius: '0.5rem',
      padding: '1rem',
      boxShadow: '0 4px 25px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #F3F4F6'
    },
    credentialCode: {
      background: '#F8F6FF',
      color: '#4D318C',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontFamily: 'monospace',
      border: '1px solid #E4D8FF'
    }
  };

  return (
    <div style={customStyles.container}>
      <div style={{ maxWidth: '28rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Back Button */}
        <div>
          <Link
            to="/"
            style={customStyles.backButton}
            onMouseEnter={(e) => e.target.style.color = '#4D318C'}
            onMouseLeave={(e) => e.target.style.color = '#7C65C1'}
            title="Back to Main Site"
          >
            <ArrowLeft size={18} style={{ color: 'inherit', marginRight: '0.5rem' }} />
            <span>Back to Main Site</span>
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={customStyles.iconContainer}>
            <Shield size={32} style={{ color: '#ffffff' }} />
          </div>
          <h2 style={{ marginTop: '1.5rem', fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Admin Portal
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Sign in to your administrator account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={customStyles.formContainer}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Username Field */}
              <div>
                <label htmlFor="username" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <User size={20} style={{ color: '#9CA3AF' }} />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    style={customStyles.input}
                    onFocus={(e) => Object.assign(e.target.style, customStyles.inputFocus)}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#D1D5DB';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Lock size={20} style={{ color: '#9CA3AF' }} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    style={{ ...customStyles.input, paddingRight: '2.5rem' }}
                    onFocus={(e) => Object.assign(e.target.style, customStyles.inputFocus)}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#D1D5DB';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} style={{ color: '#9CA3AF' }} />
                    ) : (
                      <Eye size={20} style={{ color: '#9CA3AF' }} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={customStyles.errorMessage}>
                {error}
              </div>
            )}

            {/* Login Button */}
            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="submit"
                style={customStyles.loginButton}
                onMouseEnter={(e) => Object.assign(e.target.style, customStyles.loginButtonHover)}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #7C65C1 0%, #4D318C 100%)';
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = 'none';
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Loading size="sm" />
                    <span style={{ marginLeft: '0.5rem' }}>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Demo Credentials */}
        <div style={{ textAlign: 'center' }}>
          <div style={customStyles.demoCredentials}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>Demo Credentials:</h3>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>Super Admin:</strong></span>
                <code style={customStyles.credentialCode}>admin / admin123</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>Project Manager:</strong></span>
                <code style={customStyles.credentialCode}>project.manager / pm123</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>Finance Admin:</strong></span>
                <code style={customStyles.credentialCode}>finance.admin / finance123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;