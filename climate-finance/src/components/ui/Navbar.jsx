import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

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
      isActive: path === '/funding-sources' 
    },
    { 
      to: isAuthenticated ? '/admin/dashboard' : '/admin/login', 
      label: 'Admin', 
      isActive: path.startsWith('/admin')
    },
    { to: null, label: 'Reports', isDisabled: true },
    { to: null, label: 'About', isDisabled: true }
  ];

  const allNavLinks = navLinks;

  return (
    <header className="shadow-sm py-4 border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="layout-container px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
              <h1 className="text-xl font-bold text-primary-dark group-hover:text-primary transition-colors duration-200">
                Climate Finance
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {allNavLinks.map((link, index) => (
              link.isDisabled ? (
                <span 
                  key={index}
                  className="text-gray-400 cursor-not-allowed"
                  title="Coming Soon"
                >
                  {link.label}
                </span>
              ) : (
                <Link 
                  key={index}
                  to={link.to} 
                  className={`transition-colors duration-200 ${
                    link.isActive 
                      ? 'text-primary font-medium'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <Menu size={24} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-desktop mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            {allNavLinks.map((link, index) => (
              link.isDisabled ? (
                <span 
                  key={index}
                  className="text-gray-400 cursor-not-allowed py-2"
                  title="Coming Soon"
                >
                  {link.label}
                </span>
              ) : (
                <Link 
                  key={index}
                  to={link.to} 
                  className={`py-2 transition-colors duration-200 ${
                    link.isActive 
                      ? 'text-primary font-medium'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;