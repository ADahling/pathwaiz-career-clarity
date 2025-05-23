
import React from 'react';

interface PaymentStepsProps {
  currentStep: number;
}

const PaymentSteps: React.FC<PaymentStepsProps> = ({ currentStep }) => {
  return (
    <div className="payment-steps">
      <div className={`payment-step ${currentStep >= 1 ? 'active' : ''}`}>
        <div className="step-number">1</div>
        <div className="step-label">Select Plan</div>
      </div>
      <div className="step-connector"></div>
      <div className={`payment-step ${currentStep >= 2 ? 'active' : ''}`}>
        <div className="step-number">2</div>
        <div className="step-label">Payment Details</div>
      </div>
      <div className="step-connector"></div>
      <div className={`payment-step ${currentStep >= 3 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <div className="step-label">Confirmation</div>
      </div>
    </div>
  );
};

export default PaymentSteps;
