
import React, { createContext, useContext, useState } from 'react';
import { toast } from '@/components/ui/sonner';

interface ErrorContextType {
  captureError: (error: any, message?: string) => any; // Updated to return any
  handleError: (error: any, message?: string) => void;
}

const defaultErrorContext: ErrorContextType = {
  captureError: () => {},
  handleError: () => {},
};

export const ErrorContext = createContext<ErrorContextType>(defaultErrorContext);

export const useError = () => useContext(ErrorContext);
export const useErrorContext = useError; // Alias for backward compatibility

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<any[]>([]);

  const captureError = (error: any, message?: string) => {
    console.error('Error captured:', error);
    setErrors((prevErrors) => [...prevErrors, { error, message }]);
    return error; // Return the error so it can be used in the calling code
  };

  const handleError = (error: any, message?: string) => {
    console.error('Error handled:', error, message);
    
    // Show error message in toast
    const errorMessage = message || 
      (error?.message ? error.message : 'An unexpected error occurred');
    
    toast.error(errorMessage, {
      description: error?.details || 'Please try again or contact support if the issue persists.',
    });
    
    // Add error to the captured errors
    captureError(error, message);
  };

  return (
    <ErrorContext.Provider value={{ captureError, handleError }}>
      {children}
    </ErrorContext.Provider>
  );
};
