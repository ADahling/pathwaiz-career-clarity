
import React from 'react';

interface PaymentSummaryProps {
  selectedOption: {
    id: string;
    name: string;
    description: string;
    price: number;
    interval: 'one-time' | 'monthly' | 'yearly';
    features: string[];
    popular?: boolean;
  } | null;
  mentor: {
    id: string;
    name: string;
    hourlyRate: number;
    profileImage: string;
  };
  booking: any;
  discount: number;
  promoApplied: boolean;
  calculateFinalAmount: () => number;
  handleRemovePromoCode: () => void;
  onChangePlan: () => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ 
  selectedOption, 
  mentor, 
  booking, 
  discount, 
  promoApplied, 
  calculateFinalAmount,
  handleRemovePromoCode,
  onChangePlan
}) => {
  if (!selectedOption) return null;
  
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="payment-summary">
      <div className="payment-summary-header">
        <h2>Booking Summary</h2>
        <button 
          className="change-plan-button"
          onClick={onChangePlan}
        >
          Change Plan
        </button>
      </div>
      
      <div className="payment-mentor-info">
        <img 
          src={mentor.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'} 
          alt={mentor.name} 
          className="payment-mentor-image"
        />
        <div>
          <h3 className="payment-mentor-name">{mentor.name}</h3>
          <p className="payment-session-type">{selectedOption.name}</p>
        </div>
      </div>
      
      <div className="payment-details">
        <div className="payment-detail-item">
          <span className="payment-detail-label">Plan</span>
          <span className="payment-detail-value">{selectedOption.name}</span>
        </div>
        
        <div className="payment-detail-item">
          <span className="payment-detail-label">Billing</span>
          <span className="payment-detail-value">
            {selectedOption.interval === 'one-time' ? 'One-time payment' : 
             selectedOption.interval === 'monthly' ? 'Monthly subscription' : 
             'Annual subscription'}
          </span>
        </div>
        
        <div className="payment-detail-item">
          <span className="payment-detail-label">First Session</span>
          <span className="payment-detail-value">{formattedDate}, {booking.time}</span>
        </div>
        
        <div className="payment-detail-item">
          <span className="payment-detail-label">Subtotal</span>
          <span className="payment-detail-value">${selectedOption.price.toFixed(2)}</span>
        </div>
        
        {promoApplied && (
          <div className="payment-detail-item discount-item">
            <span className="payment-detail-label">Discount ({discount}%)</span>
            <span className="payment-detail-value">-${((selectedOption.price * discount) / 100).toFixed(2)}</span>
          </div>
        )}
        
        <div className="payment-detail-item payment-total">
          <span className="payment-detail-label">Total</span>
          <span className="payment-detail-value">
            ${(calculateFinalAmount() / 100).toFixed(2)}
            {selectedOption.interval !== 'one-time' && 
              <span className="payment-interval">
                /{selectedOption.interval === 'monthly' ? 'month' : 'year'}
              </span>
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
