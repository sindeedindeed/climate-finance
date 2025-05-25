import React from 'react';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';

const PageLayout = ({ children, bgColor = "bg-gray-100" }) => {
  return (
    <div className={`min-h-screen ${bgColor} text-gray-800 flex flex-col`}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;