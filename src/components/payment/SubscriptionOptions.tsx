import React, { useState } from 'react';
import './SubscriptionOptions.css';

interface SubscriptionOption {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'one-time' | 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

interface SubscriptionOptionsProps {
  onSelect: (option: SubscriptionOption) => void;
  selectedOptionId: string | null;
}

const SubscriptionOptions: React.FC<SubscriptionOptionsProps> = ({ 
  onSelect, 
  selectedOptionId 
}) => {
  const subscriptionOptions: SubscriptionOption[] = [
    {
      id: 'one-time',
      name: 'Single Session',
      description: 'One-time mentorship session',
      price: 75,
      interval: 'one-time',
      features: [
        'One 60-minute session',
        'Session recording',
        'Follow-up notes',
        'No recurring charges'
      ]
    },
    {
      id: 'monthly',
      name: 'Monthly Mentorship',
      description: 'Ongoing monthly support',
      price: 199,
      interval: 'monthly',
      features: [
        'Four 60-minute sessions per month',
        'Priority scheduling',
        'Direct messaging with mentor',
        'Session recordings',
        'Personalized growth plan'
      ],
      popular: true
    },
    {
      id: 'yearly',
      name: 'Annual Plan',
      description: 'Long-term mentorship journey',
      price: 1899,
      interval: 'yearly',
      features: [
        'Four 60-minute sessions per month',
        'Priority scheduling',
        'Direct messaging with mentor',
        'Session recordings',
        'Personalized growth plan',
        'Quarterly progress reviews',
        'Save $489 compared to monthly'
      ]
    }
  ];

  const handleSelect = (option: SubscriptionOption) => {
    onSelect(option);
  };

  return (
    <div className="subscription-options">
      <h2 className="subscription-options-title">Choose Your Mentorship Plan</h2>
      <p className="subscription-options-subtitle">Select the plan that best fits your mentorship needs</p>
      
      <div className="subscription-options-grid">
        {subscriptionOptions.map((option) => (
          <div 
            key={option.id}
            className={`subscription-option ${selectedOptionId === option.id ? 'selected' : ''} ${option.popular ? 'popular' : ''}`}
            onClick={() => handleSelect(option)}
          >
            {option.popular && (
              <div className="popular-badge">
                Most Popular
              </div>
            )}
            
            <div className="subscription-option-header">
              <h3 className="subscription-option-name">{option.name}</h3>
              <p className="subscription-option-description">{option.description}</p>
            </div>
            
            <div className="subscription-option-price">
              <span className="price-amount">${option.price}</span>
              <span className="price-interval">
                {option.interval === 'one-time' ? 'one-time' : 
                 option.interval === 'monthly' ? '/month' : '/year'}
              </span>
            </div>
            
            <ul className="subscription-option-features">
              {option.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button 
              className={`subscription-option-button ${selectedOptionId === option.id ? 'selected' : ''}`}
            >
              {selectedOptionId === option.id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionOptions;
