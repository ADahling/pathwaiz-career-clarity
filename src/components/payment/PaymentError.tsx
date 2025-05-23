
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentErrorProps {
  errorMessage: string;
  onRetry?: () => void;
  showDashboardLink?: boolean;
}

const PaymentError: React.FC<PaymentErrorProps> = ({ 
  errorMessage, 
  onRetry = () => window.location.reload(),
  showDashboardLink = false
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="payment-page-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <h2>{showDashboardLink ? 'Booking Not Found' : 'Something went wrong'}</h2>
      <p>{errorMessage}</p>
      <button 
        className="payment-page-button"
        onClick={showDashboardLink ? () => navigate('/dashboard') : onRetry}
      >
        {showDashboardLink ? 'Go to Dashboard' : 'Try Again'}
      </button>
    </div>
  );
};

export default PaymentError;
