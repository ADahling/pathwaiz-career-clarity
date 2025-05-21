
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorProvider } from '@/contexts/ErrorContext.tsx';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Routes from '@/Routes';
import { Toaster } from '@/components/ui/sonner';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <Router>
          <AuthProvider>
            <Routes />
            <Toaster />
          </AuthProvider>
        </Router>
      </ErrorProvider>
    </ErrorBoundary>
  );
};

export default App;
