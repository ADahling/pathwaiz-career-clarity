
import React from 'react';

interface PaymentSuccessProps {
  mentor: {
    name: string;
  };
  booking: {
    date: string;
    time: string;
  };
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ mentor, booking }) => {
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="payment-success">
      <svg xmlns="http://www.w3.org/2000/svg" className="success-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <h2>Payment Successful!</h2>
      <p>Your session with {mentor.name} has been confirmed for {formattedDate} at {booking.time}.</p>
      <p className="redirect-message">Redirecting to your dashboard...</p>
    </div>
  );
};

export default PaymentSuccess;
