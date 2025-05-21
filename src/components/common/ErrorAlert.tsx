import React from 'react';
import { AppError, ErrorSeverity } from '@/services/errorService';

interface ErrorAlertProps {
  error: AppError;
  onDismiss?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss }) => {
  // Determine CSS class based on severity
  const getAlertClass = () => {
    switch (error.severity) {
      case ErrorSeverity.INFO:
        return 'error-alert-info';
      case ErrorSeverity.WARNING:
        return 'error-alert-warning';
      case ErrorSeverity.CRITICAL:
        return 'error-alert-critical';
      case ErrorSeverity.ERROR:
      default:
        return 'error-alert-error';
    }
  };

  return (
    <div className={`error-alert ${getAlertClass()}`}>
      <div className="error-alert-icon">
        {error.severity === ErrorSeverity.INFO && <InfoIcon />}
        {error.severity === ErrorSeverity.WARNING && <WarningIcon />}
        {error.severity === ErrorSeverity.ERROR && <ErrorIcon />}
        {error.severity === ErrorSeverity.CRITICAL && <CriticalIcon />}
      </div>
      <div className="error-alert-content">
        <p className="error-alert-message">{error.userMessage}</p>
        {error.severity === ErrorSeverity.CRITICAL && (
          <p className="error-alert-help">
            Please try again later or contact support if the problem persists.
          </p>
        )}
      </div>
      {onDismiss && (
        <button className="error-alert-dismiss" onClick={onDismiss}>
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

// Simple icon components
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const CriticalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default ErrorAlert;
