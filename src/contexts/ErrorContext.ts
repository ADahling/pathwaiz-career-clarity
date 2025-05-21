
import { createContext, useContext } from 'react';

interface ErrorContextType {
  captureError: (error: any, message?: string) => void;
  handleError: (error: any, message?: string) => void;
}

const defaultErrorContext: ErrorContextType = {
  captureError: () => {},
  handleError: () => {},
};

export const ErrorContext = createContext<ErrorContextType>(defaultErrorContext);

export const useError = () => useContext(ErrorContext);
export const useErrorContext = useError; // Alias for backward compatibility
export { ErrorProvider } from './ErrorContext.tsx'; // Export ErrorProvider from the implementation file
