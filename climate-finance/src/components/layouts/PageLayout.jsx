import React from 'react';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import ErrorBoundary from '../ui/ErrorBoundary';

const PageLayout = ({ 
  children, 
  bgColor = "bg-gray-50",
  maxWidth = "max-w-6xl mx-auto",
  padding = "px-4 sm:px-6 lg:px-8" 
}) => {
  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${bgColor} text-gray-800 flex flex-col`}>
        <Navbar />
        {/* Main content with proper responsive container */}
        <main className={`flex-grow py-4 sm:py-6 lg:py-8 ${maxWidth} ${padding}`}>
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