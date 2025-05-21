import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/AuthContext';
import { useError } from '@/contexts/ErrorContext';
import './PaymentForm.css';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ bookingId, amount, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { captureError } = useError();
  
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [booking, setBooking] = useState<any>(null);
  
  // Calculate mentor payout and platform fee based on 80/20 split
  const calculatePaymentBreakdown = (totalAmount: number) => {
    const mentorShare = totalAmount * 0.8; // 80% to mentor
    const platformFee = totalAmount * 0.2; // 20% to platform
    
    return {
      mentorShare: parseFloat(mentorShare.toFixed(2)),
      platformFee: parseFloat(platformFee.toFixed(2))
    };
  };
  
  const { mentorShare, platformFee } = calculatePaymentBreakdown(amount);
  
  useEffect(() => {
    if (!bookingId) return;
    
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            mentors:mentor_id(*)
          `)
          .eq('id', bookingId)
          .single();
          
        if (error) throw error;
        
        setBooking(data);
        
        // Create payment intent
        await createPaymentIntent(data);
      } catch (error) {
        captureError(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId, captureError]);
  
  const createPaymentIntent = async (bookingData: any) => {
    try {
      // In a real implementation, this would call your backend API
      // For demo purposes, we're simulating the response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate client secret
      setClientSecret('pi_simulated_secret_' + Math.random().toString(36).substring(2, 15));
    } catch (error) {
      captureError(error);
    }
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!clientSecret) {
      captureError(new Error('Payment not initialized'));
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real implementation, this would confirm the payment with Stripe
      // For demo purposes, we're simulating success
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update booking status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          payment_status: 'paid',
          payment_date: new Date().toISOString()
        })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Create payment record with mentor/platform split
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            booking_id: bookingId,
            user_id: user?.id,
            amount,
            mentor_share: mentorShare,
            platform_fee: platformFee,
            currency: 'USD',
            status: 'succeeded',
            payment_method: paymentMethod,
            created_at: new Date().toISOString()
          }
        ]);
        
      if (paymentError) throw paymentError;
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      captureError(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !booking) {
    return (
      <div className="payment-form-loading">
        <div className="spinner"></div>
        <p>Initializing payment...</p>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="payment-form-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h3>Booking Not Found</h3>
        <p>We couldn't find the booking information. Please try again or contact support.</p>
        <button 
          className="payment-form-button"
          onClick={onCancel}
        >
          Go Back
        </button>
      </div>
    );
  }
  
  const mentor = booking.mentors;
  const sessionDate = new Date(booking.date);
  const formattedDate = sessionDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Determine session duration and type
  const getDurationFromSessionType = (sessionType: string) => {
    switch(sessionType.toLowerCase()) {
      case 'quick advice':
        return '15 minutes';
      case 'deep dive':
        return '30 minutes';
      case 'comprehensive session':
      default:
        return '60 minutes';
    }
  };
  
  const sessionDuration = getDurationFromSessionType(booking.session_type);
  
  return (
    <div className="payment-form">
      <div className="payment-form-header">
        <h2>Complete Your Payment</h2>
        <p>Secure payment for your mentorship session</p>
      </div>
      
      <div className="payment-form-summary">
        <div className="payment-form-mentor">
          <img 
            src={mentor?.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg'} 
            alt={mentor?.name} 
            className="payment-form-mentor-image"
          />
          <div>
            <h3>{mentor?.name}</h3>
            <p>{mentor?.title}</p>
          </div>
        </div>
        
        <div className="payment-form-details">
          <div className="payment-form-detail">
            <span className="payment-form-label">Session Date:</span>
            <span className="payment-form-value">{formattedDate}</span>
          </div>
          <div className="payment-form-detail">
            <span className="payment-form-label">Session Time:</span>
            <span className="payment-form-value">{booking.time}</span>
          </div>
          <div className="payment-form-detail">
            <span className="payment-form-label">Session Type:</span>
            <span className="payment-form-value">{booking.session_type}</span>
          </div>
          <div className="payment-form-detail">
            <span className="payment-form-label">Duration:</span>
            <span className="payment-form-value">{sessionDuration}</span>
          </div>
        </div>
        
        <div className="payment-form-amount">
          <div className="payment-form-subtotal">
            <span>Subtotal</span>
            <span>${amount.toFixed(2)}</span>
          </div>
          <div className="payment-form-breakdown">
            <div className="payment-form-mentor-share">
              <span>Mentor Share (80%)</span>
              <span>${mentorShare.toFixed(2)}</span>
            </div>
            <div className="payment-form-platform-fee">
              <span>Platform Fee (20%)</span>
              <span>${platformFee.toFixed(2)}</span>
            </div>
          </div>
          <div className="payment-form-tax">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
          <div className="payment-form-total">
            <span>Total</span>
            <span>${amount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <form onSubmit={handleSubmit} className="payment-form-elements">
            <div className="payment-form-methods">
              <h3>Payment Method</h3>
              
              <div className="payment-form-method-options">
                <div 
                  className={`payment-form-method-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="payment-form-method-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 4H2c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h20c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H2V9h20v9zM2 6v1h20V6H2zm4 11h8v-2H6v2z" />
                    </svg>
                  </div>
                  <div className="payment-form-method-info">
                    <div className="payment-form-method-name">Credit Card</div>
                    <div className="payment-form-method-description">Pay with Visa, Mastercard, or American Express</div>
                  </div>
                </div>
                
                <div 
                  className={`payment-form-method-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div className="payment-form-method-icon paypal">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.93 4.24h5.14c2.1 0 3.92 1.18 4.32 3.31.39 2.12-1.15 3.31-3.25 3.31h-2.42c-.2 0-.37.14-.4.34l-.68 4.38H9.93l2.48-11.34zm3.9 4.96h1.42c.79 0 1.32-.43 1.17-1.13-.15-.7-.79-1.13-1.58-1.13h-1.42l-.59 2.26z" />
                      <path d="M3.04 4.24h5.14c2.1 0 3.92 1.18 4.32 3.31.39 2.12-1.15 3.31-3.25 3.31H6.83c-.2 0-.37.14-.4.34l-.68 4.38H3.04l2.48-11.34zm3.9 4.96h1.42c.79 0 1.32-.43 1.17-1.13-.15-.7-.79-1.13-1.58-1.13H6.53l-.59 2.26z" />
                    </svg>
                  </div>
                  <div className="payment-form-method-info">
                    <div className="payment-form-method-name">PayPal</div>
                    <div className="payment-form-method-description">Pay with your PayPal account</div>
                  </div>
                </div>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="payment-form-card-details">
                  <div className="payment-form-group">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456" 
                      className="payment-form-input"
                    />
                  </div>
                  
                  <div className="payment-form-row">
                    <div className="payment-form-group">
                      <label>Expiration Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="payment-form-input"
                      />
                    </div>
                    
                    <div className="payment-form-group">
                      <label>CVC</label>
                      <input 
                        type="text" 
                        placeholder="123" 
                        className="payment-form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="payment-form-group">
                    <label>Name on Card</label>
                    <input 
                      type="text" 
                      placeholder="John Smith" 
                      className="payment-form-input"
                    />
                  </div>
                </div>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="payment-form-paypal">
                  <p>You will be redirected to PayPal to complete your payment.</p>
                </div>
              )}
            </div>
            
            <div className="payment-form-actions">
              <button 
                type="button" 
                className="payment-form-button-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="payment-form-button-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="payment-form-spinner"></span>
                    Processing...
                  </>
                ) : (
                  `Pay $${amount.toFixed(2)}`
                )}
              </button>
            </div>
          </form>
        </Elements>
      )}
      
      <div className="payment-form-security">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="security-icon">
          <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
        </svg>
        <p>Your payment information is secure. We use industry-standard encryption to protect your data.</p>
      </div>
    </div>
  );
};

export default PaymentForm;
