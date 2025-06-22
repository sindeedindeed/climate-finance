import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', isActive: path === '/' },
    { 
      to: '/projects', 
      label: 'Projects', 
      isActive: path === '/projects' || path.startsWith('/projects/') 
    },
    { 
      to: '/funding-sources', 
      label: 'Funding Sources', 
      isActive: path === '/funding-sources' || path.startsWith('/funding-sources/')
    },
    { 
      to: isAuthenticated ? '/admin/dashboard' : '/admin/login', 
      label: 'Admin', 
      isActive: path.startsWith('/admin')
    },
    { to: '/about', label: 'About', isActive: path === '/about' }
  ];

  return (
    <header className="shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
              <h1 className="text-xl font-bold text-purple-700 group-hover:text-purple-600 transition-colors duration-200">
                Climate Finance
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link, index) => (
              link.isDisabled ? (
                <span 
                  key={index}
                  className="text-gray-400 cursor-not-allowed text-sm font-medium"
                  title="Coming Soon"
                >
                  {link.label}
                </span>
              ) : (
                <Link 
                  key={index}
                  to={link.to} 
                  className={`text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${
                    link.isActive 
                      ? 'text-purple-700'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <Menu size={24} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Improved */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden bg-white border-t border-gray-100 shadow-lg`}>
        <nav className="px-4 py-4 space-y-1">
          {navLinks.map((link, index) => (
            link.isDisabled ? (
              <div 
                key={index}
                className="px-4 py-3 text-gray-400 cursor-not-allowed text-sm font-medium"
                title="Coming Soon"
              >
                {link.label}
              </div>
            ) : (
              <Link 
                key={index}
                to={link.to} 
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  link.isActive 
                    ? 'text-purple-700'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;