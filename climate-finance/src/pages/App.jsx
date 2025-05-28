import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui/Toast';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import Routing from '../routing';

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <ToastProvider>
          <Routing />
        </ToastProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;