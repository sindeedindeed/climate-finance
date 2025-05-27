import React from 'react';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import ErrorBoundary from '../ui/ErrorBoundary';

const PageLayout = ({ 
  children, 
  bgColor = "bg-gray-50",
  maxWidth = "max-w-desktop",
  padding = "px-4 sm:px-6 xl:px-8" 
}) => {
  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${bgColor} text-gray-800 flex flex-col`}>
        <Navbar />
          {/* Main content */}
        <main className={`
          flex-grow py-6
          ${maxWidth} mx-auto w-full ${padding}
        `}>
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default PageLayout;