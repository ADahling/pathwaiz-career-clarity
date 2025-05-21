import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorProvider } from '@/contexts/ErrorContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Routes from '@/Routes';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <Router>
          <Routes />
        </Router>
      </ErrorProvider>
    </ErrorBoundary>
  );
};

export default App;
