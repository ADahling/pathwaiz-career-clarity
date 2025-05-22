
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; 
import { useAuth } from '@/contexts/AuthContext';
import PaymentForm from '@/components/payment/PaymentForm';
import SubscriptionOptions from '@/components/payment/SubscriptionOptions';
import PromoCodeInput from '@/components/payment/PromoCodeInput';
import './Payment.css';

interface SubscriptionOption {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'one-time' | 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

const Payment = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<any>(null);
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SubscriptionOption | null>(null);
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        if (!bookingId) {
          throw new Error('Booking ID is required');
        }
        
        // Modify the query to use a specific join with mentor_id as the foreign key
        const { data: bookingData, error } = await supabase
          .from('bookings')
          .select(`
            *,
            mentor:mentor_id (
              id,
              name,
              hourly_rate
            )
          `)
          .eq('id', bookingId)
          .single();
          
        if (error) throw error;
        
        if (!bookingData) {
          // If no data, use placeholder for development
          const placeholderBooking = {
            id: bookingId,
            mentee_id: user.id,
            mentor_id: 'mentor-1',
            date: new Date().toISOString().split('T')[0],
            time: '14:00',
            session_type: 'Career Guidance',
            topic: 'Transitioning to product management',
            status: 'pending',
            payment_status: 'pending',
            created_at: new Date().toISOString(),
            mentor: {
              id: 'mentor-1',
              name: 'Mentor Name', 
              hourly_rate: 75
            }
          };
          
          setBooking(placeholderBooking);
          setMentor({
            id: 'mentor-1',
            name: 'Alex Johnson',
            hourlyRate: 75,
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
          });
        } else {
          setBooking(bookingData);
          
          // Extract mentor info from the joined data
          const mentorInfo = {
            id: bookingData.mentor?.id || 'unknown',
            name: bookingData.mentor?.name || 'Unknown Mentor',
            hourlyRate: bookingData.mentor?.hourly_rate || 75,
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg' // Placeholder
          };
          
          setMentor(mentorInfo);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to load booking information. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [user, bookingId, navigate]);
  
  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    
    // Redirect to dashboard after a delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };
  
  const handleCancel = () => {
    navigate(`/booking/${booking?.mentor_id}`);
  };

  const handleSubscriptionSelect = (option: SubscriptionOption) => {
    setSelectedOption(option);
  };

  const handleApplyPromoCode = async (code: string): Promise<boolean> => {
    // In a real implementation, this would validate the promo code with your backend
    // For this placeholder, we'll simulate a successful promo code application
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate a valid promo code that gives 15% off
        if (code.toUpperCase() === 'WELCOME15') {
          setDiscount(15);
          setPromoApplied(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const handleRemovePromoCode = () => {
    setDiscount(0);
    setPromoApplied(false);
  };
  
  // Calculate final amount based on selected option and discount
  const calculateFinalAmount = () => {
    if (!selectedOption) {
      return mentor?.hourlyRate * 100 || 7500; // Default to hourly rate in cents
    }
    
    const baseAmount = selectedOption.price * 100; // Convert to cents
    if (discount > 0) {
      return baseAmount - (baseAmount * discount / 100);
    }
    return baseAmount;
  };
  
  if (loading) {
    return (
      <div className="payment-page-loading">
        <div className="spinner"></div>
        <p>Loading payment information...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="payment-page-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button 
          className="payment-page-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!booking || !mentor) {
    return (
      <div className="payment-page-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h2>Booking Not Found</h2>
        <p>We couldn't find the booking you're looking for.</p>
        <button 
          className="payment-page-button"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }
  
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="payment-page">
      <div className="payment-page-header">
        <h1 className="payment-page-title">Complete Your Booking</h1>
        <p className="payment-page-subtitle">Secure your session with {mentor.name}</p>
      </div>
      
      {paymentSuccess ? (
        <div className="payment-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="success-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h2>Payment Successful!</h2>
          <p>Your session with {mentor.name} has been confirmed for {formattedDate} at {booking.time}.</p>
          <p className="redirect-message">Redirecting to your dashboard...</p>
        </div>
      ) : (
        <div className="payment-page-content">
          <div className="payment-steps">
            <div className="payment-step active">
              <div className="step-number">1</div>
              <div className="step-label">Select Plan</div>
            </div>
            <div className="step-connector"></div>
            <div className={`payment-step ${selectedOption ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Payment Details</div>
            </div>
            <div className="step-connector"></div>
            <div className="payment-step">
              <div className="step-number">3</div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>
          
          {!selectedOption ? (
            <div className="subscription-section">
              <SubscriptionOptions 
                onSelect={handleSubscriptionSelect}
                selectedOptionId={selectedOption?.id || null}
              />
            </div>
          ) : (
            <div className="payment-details-section">
              <div className="payment-summary">
                <div className="payment-summary-header">
                  <h2>Booking Summary</h2>
                  <button 
                    className="change-plan-button"
                    onClick={() => setSelectedOption(null)}
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
                
                <PromoCodeInput 
                  onApply={handleApplyPromoCode}
                  onRemove={handleRemovePromoCode}
                  disabled={paymentSuccess}
                />
              </div>
              
              <div className="payment-form-container">
                <PaymentForm 
                  bookingId={booking.id}
                  amount={calculateFinalAmount()}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setSelectedOption(null)}
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="payment-page-footer">
        <div className="payment-guarantee">
          <svg className="guarantee-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="guarantee-text">
            <h3>100% Satisfaction Guarantee</h3>
            <p>If you're not completely satisfied with your first session, we'll refund your payment in full.</p>
          </div>
        </div>
        
        <div className="payment-security">
          <div className="security-badges">
            <div className="security-badge">
              <svg className="security-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure Checkout</span>
            </div>
            <div className="security-badge">
              <svg className="security-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span>Detailed Receipt</span>
            </div>
            <div className="security-badge">
              <svg className="security-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              <span>Data Protection</span>
            </div>
          </div>
          <p className="security-text">
            Your payment information is encrypted and securely processed by Stripe. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
