
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import './PaymentHistory.css';

interface PaymentHistoryProps {
  userId: string;
}

interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  transaction_id?: string;
  bookings?: any;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ userId }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, [userId]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');

      // Since the 'payments' table doesn't exist yet, we'll use mock data
      // This would be the real query once the table exists:
      /*
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          bookings:booking_id(
            *,
            mentors:mentor_id(*),
            mentees:mentee_id(*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
      */
      
      // Mock data for development
      const mockPayments: Payment[] = [
        {
          id: '1',
          booking_id: '101',
          user_id: userId,
          amount: 50,
          status: 'succeeded',
          payment_method: 'card',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          transaction_id: 'txn_' + Math.random().toString(36).substring(2, 10),
          bookings: {
            id: '101',
            session_type: 'Quick Advice',
            date: new Date().toISOString(),
            time: '14:00',
            mentors: {
              name: 'Jane Smith',
              profile_image: 'https://randomuser.me/api/portraits/women/32.jpg'
            }
          }
        },
        {
          id: '2',
          booking_id: '102',
          user_id: userId,
          amount: 100,
          status: 'succeeded',
          payment_method: 'paypal',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
          transaction_id: 'txn_' + Math.random().toString(36).substring(2, 10),
          bookings: {
            id: '102',
            session_type: 'Deep Dive',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days ago
            time: '10:30',
            mentors: {
              name: 'John Doe',
              profile_image: 'https://randomuser.me/api/portraits/men/44.jpg'
            }
          }
        }
      ];
      
      setPayments(mockPayments);
      
    } catch (err) {
      console.error('Error fetching payment history:', err);
      setError('Failed to load payment history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="payment-history-container">
      <h2 className="payment-history-title">Payment History</h2>

      {loading ? (
        <div className="payment-history-loading">
          <div className="spinner"></div>
          <p>Loading payment history...</p>
        </div>
      ) : error ? (
        <div className="payment-history-error">
          <p>{error}</p>
          <button 
            className="payment-history-retry"
            onClick={fetchPayments}
          >
            Try Again
          </button>
        </div>
      ) : payments.length === 0 ? (
        <div className="payment-history-empty">
          <svg xmlns="http://www.w3.org/2000/svg" className="empty-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <h3>No payment history</h3>
          <p>You haven't made any payments yet. Once you book and pay for sessions, they'll appear here.</p>
        </div>
      ) : (
        <div className="payment-history-list">
          {payments.map(payment => {
            const booking = payment.bookings;
            const otherParty = booking?.mentors || booking?.mentees;
            
            return (
              <div key={payment.id} className="payment-history-item">
                <div className="payment-history-date">
                  {formatDate(payment.created_at)}
                </div>
                
                <div className="payment-history-details">
                  <div className="payment-history-session">
                    <div className="payment-history-user">
                      {otherParty && (
                        <img 
                          src={otherParty.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                          alt={otherParty.name}
                          className="payment-history-avatar"
                        />
                      )}
                      <div>
                        <h3 className="payment-history-name">
                          {booking ? `Session with ${otherParty?.name}` : 'Payment'}
                        </h3>
                        {booking && (
                          <p className="payment-history-session-details">
                            {booking.session_type} • {formatDate(booking.date)} • {booking.time}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="payment-history-amount">
                      ${payment.amount.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="payment-history-meta">
                    <div className="payment-history-method">
                      <span className="payment-history-label">Payment Method:</span>
                      <span className="payment-history-value">
                        {payment.payment_method === 'card' ? 'Credit Card' : 'PayPal'}
                      </span>
                    </div>
                    
                    <div className="payment-history-status">
                      <span className="payment-history-label">Status:</span>
                      <span className={`payment-history-value status-${payment.status}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="payment-history-id">
                      <span className="payment-history-label">Transaction ID:</span>
                      <span className="payment-history-value">
                        {payment.transaction_id || `txn_${payment.id.substring(0, 8)}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="payment-history-actions">
                    <button className="payment-history-button">
                      View Receipt
                    </button>
                    {payment.status === 'succeeded' && (
                      <button className="payment-history-button secondary">
                        Request Refund
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
