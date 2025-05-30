import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, FolderOpen, DollarSign, FileText, Info } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <Home size={16} />, isActive: path === '/' },
    { 
      to: '/projects', 
      label: 'Projects', 
      icon: <FolderOpen size={16} />,
      isActive: path === '/projects' || path.startsWith('/projects/') 
    },
    { 
      to: '/funding-sources', 
      label: 'Funding Sources', 
      icon: <DollarSign size={16} />,
      isActive: path === '/funding-sources' 
    },
    { to: null, label: 'Reports', icon: <FileText size={16} />, isDisabled: true },
    { to: null, label: 'About', icon: <Info size={16} />, isDisabled: true }
  ];  return (
    <header className="bg-white shadow-sm py-4 border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
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
            {navLinks.map((link, index) => (
              link.isDisabled ? (
                <span 
                  key={index}
                  className="text-gray-400 cursor-not-allowed flex items-center gap-2"
                  title="Coming Soon"
                >
                  {link.icon}
                  {link.label}
                </span>
              ) : (
                <Link 
                  key={index}
                  to={link.to} 
                  className={`transition-colors duration-200 flex items-center gap-2 ${
                    link.isActive 
                      ? 'text-primary font-medium' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {link.icon}
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
      </div>      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-desktop mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            {navLinks.map((link, index) => (
              link.isDisabled ? (
                <span 
                  key={index}
                  className="text-gray-400 cursor-not-allowed py-2 flex items-center gap-3"
                  title="Coming Soon"
                >
                  {link.icon}
                  {link.label}
                </span>
              ) : (
                <Link 
                  key={index}
                  to={link.to} 
                  className={`py-2 transition-colors duration-200 flex items-center gap-3 ${
                    link.isActive 
                      ? 'text-primary font-medium' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon}
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