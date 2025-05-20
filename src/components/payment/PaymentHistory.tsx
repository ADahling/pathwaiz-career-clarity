import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import './PaymentHistory.css';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');

        // Fetch payments from Supabase
        const { data, error } = await supabase
          .from('payments')
          .select(`
            *,
            bookings:booking_id (
              id,
              date,
              time,
              session_type,
              mentor_id,
              mentors:mentor_id (
                profiles:profile_id (
                  full_name,
                  avatar_url
                )
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
          // Use placeholder data for development
          const placeholderData = generatePlaceholderPayments();
          setPayments(placeholderData);
        } else {
          setPayments(data);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Failed to load your payment history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const generatePlaceholderPayments = () => {
    const today = new Date();
    const placeholderPayments = [];

    // Generate past payments
    for (let i = 1; i <= 5; i++) {
      const paymentDate = new Date(today);
      paymentDate.setDate(today.getDate() - i * 7);
      
      const bookingDate = new Date(paymentDate);
      bookingDate.setDate(paymentDate.getDate() + 3);
      
      placeholderPayments.push({
        id: `payment-${i}`,
        booking_id: `booking-${i}`,
        amount: (75 * 100), // in cents
        status: 'succeeded',
        payment_method: 'card',
        email: 'user@example.com',
        created_at: paymentDate.toISOString(),
        receipt_url: '#',
        bookings: {
          id: `booking-${i}`,
          date: bookingDate.toISOString().split('T')[0],
          time: i % 2 === 0 ? '10:00' : '14:00',
          session_type: ['Career Guidance', 'Resume Review', 'Interview Preparation', 'Skill Development', 'Career Strategy'][i - 1],
          mentor_id: `mentor-${i}`,
          mentors: {
            profiles: {
              full_name: ['Alex Johnson', 'Sarah Williams', 'Michael Chen', 'David Kim', 'Emily Rodriguez'][i - 1],
              avatar_url: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${20 + i}.jpg`
            }
          }
        }
      });
    }

    return placeholderPayments;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const renderPaymentCard = (payment) => {
    const bookingDate = payment.bookings?.date ? formatDate(payment.bookings.date) : 'N/A';
    const mentorName = payment.bookings?.mentors?.profiles?.full_name || 'Mentor';
    const mentorAvatar = payment.bookings?.mentors?.profiles?.avatar_url || 'https://randomuser.me/api/portraits/men/1.jpg';
    const sessionType = payment.bookings?.session_type || 'Mentoring Session';
    const paymentDate = formatDate(payment.created_at);
    const amount = formatAmount(payment.amount);

    return (
      <div key={payment.id} className="payment-history-card">
        <div className="payment-history-card-header">
          <div className="payment-history-mentor-info">
            <img 
              src={mentorAvatar} 
              alt={mentorName} 
              className="payment-history-mentor-avatar"
            />
            <div>
              <h3 className="payment-history-mentor-name">{mentorName}</h3>
              <p className="payment-history-session-type">{sessionType}</p>
            </div>
          </div>
          <div className="payment-history-amount">{amount}</div>
        </div>
        
        <div className="payment-history-card-details">
          <div className="payment-history-detail-item">
            <span className="payment-history-detail-label">Payment Date</span>
            <span className="payment-history-detail-value">{paymentDate}</span>
          </div>
          
          <div className="payment-history-detail-item">
            <span className="payment-history-detail-label">Session Date</span>
            <span className="payment-history-detail-value">{bookingDate} at {payment.bookings?.time || 'N/A'}</span>
          </div>
          
          <div className="payment-history-detail-item">
            <span className="payment-history-detail-label">Status</span>
            <span className={`payment-history-status ${payment.status}`}>
              {payment.status === 'succeeded' ? 'Paid' : payment.status}
            </span>
          </div>
          
          <div className="payment-history-detail-item">
            <span className="payment-history-detail-label">Payment Method</span>
            <span className="payment-history-detail-value">
              {payment.payment_method === 'card' ? 'Credit Card' : payment.payment_method}
            </span>
          </div>
        </div>
        
        <div className="payment-history-card-actions">
          {payment.receipt_url && (
            <a 
              href={payment.receipt_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="payment-history-action-button"
            >
              View Receipt
            </a>
          )}
        </div>
      </div>
    );
  };

  if (loading && payments.length === 0) {
    return (
      <div className="payment-history-loading">
        <div className="spinner"></div>
        <p>Loading your payment history...</p>
      </div>
    );
  }

  return (
    <div className="payment-history">
      <div className="payment-history-header">
        <h1 className="payment-history-title">Payment History</h1>
      </div>
      
      {error && (
        <div className="payment-history-error">
          <p>{error}</p>
          <button 
            className="payment-history-retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="payment-history-list">
        {payments.length > 0 ? (
          payments.map(payment => renderPaymentCard(payment))
        ) : (
          <div className="payment-history-empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" className="payment-history-empty-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <h3>No payment history</h3>
            <p>You haven't made any payments yet. Book a session with a mentor to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
