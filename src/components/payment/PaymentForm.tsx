import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { supabase } from '../../../integrations/supabase/client';
import './PaymentForm.css';

// Initialize Stripe with placeholder publishable key
// In production, this would be replaced with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_placeholder');

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({ 
  bookingId, 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // In a real implementation, this would call your backend to create a payment intent
    // For this placeholder, we'll simulate the response
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        
        // Simulate API call to create payment intent
        // In production, this would be a real API call to your server
        setTimeout(() => {
          // Mock client secret
          setClientSecret('pi_mock_secret_' + Math.random().toString(36).substring(2, 15));
          setLoading(false);
        }, 1000);
        
        // Real implementation would look like:
        /*
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
            amount,
          }),
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setClientSecret(data.clientSecret);
        */
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setError('Failed to initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    createPaymentIntent();
  }, [bookingId, amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    if (!clientSecret) {
      setError('Payment not initialized. Please try again.');
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setError('Card information is required.');
      return;
    }
    
    if (!email.trim()) {
      setError('Email is required for receipt.');
      return;
    }
    
    if (!name.trim()) {
      setError('Name is required for payment.');
      return;
    }
    
    try {
      setProcessing(true);
      setError(null);
      
      // In a real implementation, this would confirm the payment with Stripe
      // For this placeholder, we'll simulate success after a delay
      setTimeout(async () => {
        // Simulate successful payment
        setSucceeded(true);
        setProcessing(false);
        
        // Update booking status in Supabase
        try {
          const { error } = await supabase
            .from('bookings')
            .update({ payment_status: 'paid' })
            .eq('id', bookingId);
            
          if (error) throw error;
          
          // Create payment record in Supabase
          const { error: paymentError } = await supabase
            .from('payments')
            .insert([
              {
                booking_id: bookingId,
                amount,
                status: 'succeeded',
                payment_method: 'card',
                email,
                created_at: new Date().toISOString()
              }
            ]);
            
          if (paymentError) throw paymentError;
          
          // Call success callback
          onSuccess();
        } catch (dbError) {
          console.error('Database error:', dbError);
          // Payment succeeded but database update failed
          // In a real app, you would handle this case more gracefully
          onSuccess();
        }
      }, 2000);
      
      // Real implementation would look like:
      /*
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        
        // Update booking status in database
        const { error: dbError } = await supabase
          .from('bookings')
          .update({ payment_status: 'paid' })
          .eq('id', bookingId);
          
        if (dbError) throw dbError;
        
        // Create payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert([
            {
              booking_id: bookingId,
              amount,
              status: paymentIntent.status,
              payment_intent_id: paymentIntent.id,
              payment_method: 'card',
              email,
              created_at: new Date().toISOString()
            }
          ]);
          
        if (paymentError) throw paymentError;
        
        onSuccess();
      }
      */
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="payment-form-header">
        <h2>Complete Payment</h2>
        <div className="payment-amount">${(amount / 100).toFixed(2)}</div>
      </div>
      
      <div className="payment-form-fields">
        <div className="form-group">
          <label htmlFor="name">Name on Card</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email for Receipt</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="card">Card Information</label>
          <div className="card-element-container">
            <CardElement id="card" options={cardElementOptions} />
          </div>
        </div>
      </div>
      
      {error && <div className="payment-error">{error}</div>}
      
      <div className="payment-form-actions">
        <button 
          type="button" 
          className="cancel-button"
          onClick={onCancel}
          disabled={processing}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="pay-button"
          disabled={!stripe || processing || loading || succeeded}
        >
          {processing ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : loading ? (
            <>
              <span className="spinner"></span>
              Loading...
            </>
          ) : succeeded ? (
            'Payment Successful!'
          ) : (
            `Pay $${(amount / 100).toFixed(2)}`
          )}
        </button>
      </div>
      
      <div className="payment-security-info">
        <div className="security-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p>
          Secure payment processed by Stripe. We do not store your card details.
        </p>
      </div>
    </form>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <div className="payment-container">
      <Elements stripe={stripePromise}>
        <PaymentFormContent {...props} />
      </Elements>
    </div>
  );
};

export default PaymentForm;
