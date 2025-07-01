import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui/Toast';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import Routing from '../routing';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider>
              <Navbar />
              <div className="min-h-screen flex flex-col bg-gray-50">
                <main className="flex-grow">
                  <Routing />
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;