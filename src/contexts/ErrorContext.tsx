import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppError, handleError } from '@/services/errorService';
import ErrorAlert from '@/components/common/ErrorAlert';

interface ErrorContextType {
  error: AppError | null;
  setError: (error: AppError | null) => void;
  captureError: (error: any) => AppError;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<AppError | null>(null);

  const captureError = (err: any): AppError => {
    const appError = handleError(err);
    setError(appError);
    return appError;
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, setError, captureError, clearError }}>
      {error && <ErrorAlert error={error} onDismiss={clearError} />}
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
