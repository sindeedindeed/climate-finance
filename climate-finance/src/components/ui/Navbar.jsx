import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary-dark">Climate Finance</h1>
        <nav className="flex space-x-6">
          <Link 
            to="/" 
            className={`${path === '/' ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}`}
          >
            Dashboard
          </Link>          <Link 
            to="/projects" 
            className={`${path === '/projects' || path.startsWith('/projects/') ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}`}
          >
            Projects
          </Link>
          <Link 
            to="/funding-sources" 
            className={`${path === '/funding-sources' ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}`}
          >
            Funding Sources
          </Link>
          <Link 
            to="#" 
            className="text-gray-600 hover:text-primary"
          >
            Reports
          </Link>
          <Link 
            to="#" 
            className="text-gray-600 hover:text-primary"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;