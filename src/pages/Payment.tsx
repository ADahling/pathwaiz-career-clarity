import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import PaymentForm from '../../components/payment/PaymentForm';
import './Payment.css';

const Payment = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
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
        
        // Fetch booking data from Supabase
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            *,
            mentors:mentor_id (
              id, 
              hourly_rate,
              profiles:profile_id (
                full_name, 
                avatar_url
              )
            )
          `)
          .eq('id', bookingId)
          .single();
          
        if (bookingError) throw bookingError;
        
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
            mentors: {
              id: 'mentor-1',
              hourly_rate: 75,
              profiles: {
                full_name: 'Alex Johnson',
                avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg'
              }
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
          
          // Extract mentor info
          const mentorInfo = {
            id: bookingData.mentors.id,
            name: bookingData.mentors.profiles.full_name,
            hourlyRate: bookingData.mentors.hourly_rate || 75,
            profileImage: bookingData.mentors.profiles.avatar_url
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
  
  // Calculate amount in cents
  const amount = mentor.hourlyRate * 100;
  
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
          <div className="payment-summary">
            <div className="payment-summary-header">
              <h2>Booking Summary</h2>
            </div>
            
            <div className="payment-mentor-info">
              <img 
                src={mentor.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                alt={mentor.name} 
                className="payment-mentor-image"
              />
              <div>
                <h3 className="payment-mentor-name">{mentor.name}</h3>
                <p className="payment-session-type">{booking.session_type}</p>
              </div>
            </div>
            
            <div className="payment-details">
              <div className="payment-detail-item">
                <span className="payment-detail-label">Date</span>
                <span className="payment-detail-value">{formattedDate}</span>
              </div>
              
              <div className="payment-detail-item">
                <span className="payment-detail-label">Time</span>
                <span className="payment-detail-value">{booking.time}</span>
              </div>
              
              <div className="payment-detail-item">
                <span className="payment-detail-label">Topic</span>
                <span className="payment-detail-value">{booking.topic}</span>
              </div>
              
              <div className="payment-detail-item payment-total">
                <span className="payment-detail-label">Total</span>
                <span className="payment-detail-value">${mentor.hourlyRate}.00</span>
              </div>
            </div>
          </div>
          
          <div className="payment-form-container">
            <PaymentForm 
              bookingId={booking.id}
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
