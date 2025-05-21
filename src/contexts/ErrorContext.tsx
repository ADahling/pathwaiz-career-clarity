
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

interface AppError {
  message: string;
  details?: string;
  code?: string;
  originalError?: any;
}

interface ErrorContextType {
  error: AppError | null;
  setError: (error: AppError | null) => void;
  captureError: (error: any, message?: string) => void;
  handleError: (error: any, message?: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<AppError | null>(null);

  const captureError = (err: any, message?: string): void => {
    console.error('Error captured:', err);
    
    const appError: AppError = {
      message: message || 'An error occurred',
      details: err?.message || 'Unknown error',
      code: err?.code,
      originalError: err
    };
    
    setError(appError);
    
    // Show toast notification
    toast.error(appError.message, {
      description: appError.details,
      duration: 5000,
    });
  };

  const handleError = captureError; // Alias for legacy support
  
  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, setError, captureError, handleError, clearError }}>
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

export const useErrorContext = useError; // Alias for backward compatibility
