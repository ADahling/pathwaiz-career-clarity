
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PaymentForm from '@/components/payment/PaymentForm';
import SubscriptionOptions from '@/components/payment/SubscriptionOptions';
import PromoCodeInput from '@/components/payment/PromoCodeInput';
import PaymentSteps from '@/components/payment/PaymentSteps';
import PaymentSummary from '@/components/payment/PaymentSummary';
import PaymentSuccess from '@/components/payment/PaymentSuccess';
import PaymentError from '@/components/payment/PaymentError';
import PaymentFooter from '@/components/payment/PaymentFooter';
import { usePaymentLogic } from '@/hooks/usePaymentLogic';
import './Payment.css';

const Payment = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  
  const {
    booking,
    mentor,
    loading,
    error,
    paymentSuccess,
    selectedOption,
    discount,
    promoApplied,
    handlePaymentSuccess,
    handleSubscriptionSelect,
    handleApplyPromoCode,
    handleRemovePromoCode,
    calculateFinalAmount,
    setSelectedOption
  } = usePaymentLogic(bookingId);
  
  if (loading) {
    return (
      <div className="payment-page-loading">
        <div className="spinner"></div>
        <p>Loading payment information...</p>
      </div>
    );
  }
  
  if (error) {
    return <PaymentError errorMessage={error} />;
  }
  
  if (!booking || !mentor) {
    return (
      <PaymentError 
        errorMessage="We couldn't find the booking you're looking for."
        showDashboardLink={true}
      />
    );
  }
  
  return (
    <div className="payment-page">
      <div className="payment-page-header">
        <h1 className="payment-page-title">Complete Your Booking</h1>
        <p className="payment-page-subtitle">Secure your session with {mentor.name}</p>
      </div>
      
      {paymentSuccess ? (
        <PaymentSuccess mentor={mentor} booking={booking} />
      ) : (
        <div className="payment-page-content">
          <PaymentSteps currentStep={selectedOption ? 2 : 1} />
          
          {!selectedOption ? (
            <div className="subscription-section">
              <SubscriptionOptions 
                onSelect={handleSubscriptionSelect}
                selectedOptionId={selectedOption?.id || null}
              />
            </div>
          ) : (
            <div className="payment-details-section">
              <PaymentSummary
                selectedOption={selectedOption}
                mentor={mentor}
                booking={booking}
                discount={discount}
                promoApplied={promoApplied}
                calculateFinalAmount={calculateFinalAmount}
                handleRemovePromoCode={handleRemovePromoCode}
                onChangePlan={() => setSelectedOption(null)}
              />
              
              <div className="payment-form-container">
                <PaymentForm 
                  bookingId={booking.id}
                  amount={calculateFinalAmount()}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setSelectedOption(null)}
                />
              </div>
              
              {!promoApplied && (
                <PromoCodeInput 
                  onApply={handleApplyPromoCode}
                  onRemove={handleRemovePromoCode}
                  disabled={paymentSuccess}
                />
              )}
            </div>
          )}
        </div>
      )}
      
      <PaymentFooter />
    </div>
  );
};

export default Payment;
