import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui/Toast';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import Routing from '../routing';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <Routing />
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;