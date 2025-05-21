
import React, { useState, useEffect } from 'react';
import { enhancedSupabase } from '@/integrations/supabase/mockClient';
import './BookingManagement.css';

interface BookingManagementProps {
  userId: string;
  userType: 'mentor' | 'mentee';
}

const BookingManagement: React.FC<BookingManagementProps> = ({ userId, userType }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'pending'>('upcoming');

  useEffect(() => {
    fetchBookings();
  }, [userId, userType, activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const userIdField = userType === 'mentor' ? 'mentor_id' : 'mentee_id';
      
      let query = enhancedSupabase
        .from('bookings')
        .select(`
          *,
          mentors:mentor_id(*),
          mentees:mentee_id(*)
        `)
        .eq(userIdField, userId);

      // Filter by status based on active tab
      if (activeTab === 'upcoming') {
        const today = new Date().toISOString().split('T')[0];
        query = query
          .eq('status', 'confirmed')
          .gte('date', today)
          .order('date', { ascending: true });
      } else if (activeTab === 'past') {
        const today = new Date().toISOString().split('T')[0];
        query = query
          .eq('status', 'completed')
          .lt('date', today)
          .order('date', { ascending: false });
      } else if (activeTab === 'pending') {
        query = query
          .eq('status', 'pending')
          .order('date', { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;

      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      setLoading(true);
      
      const { error } = await enhancedSupabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // Refresh bookings
      fetchBookings();
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Failed to update booking status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTabs = () => {
    return (
      <div className="booking-management-tabs">
        <button 
          className={`booking-management-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`booking-management-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button 
          className={`booking-management-tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
      </div>
    );
  };

  const renderBookingCard = (booking: any) => {
    const mentor = booking.mentors;
    const mentee = booking.mentees;
    
    const bookingDate = new Date(booking.date);
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div key={booking.id} className="booking-card">
        <div className="booking-card-header">
          <div className="booking-card-date">
            {formattedDate} • {booking.time}
          </div>
          <div className={`booking-card-status booking-status-${booking.status}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </div>
        </div>
        
        <div className="booking-card-content">
          <div className="booking-card-user">
            <img 
              src={userType === 'mentor' ? mentee?.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg' : mentor?.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg'} 
              alt={userType === 'mentor' ? mentee?.name : mentor?.name}
              className="booking-card-avatar"
            />
            <div className="booking-card-user-info">
              <h3 className="booking-card-name">
                {userType === 'mentor' ? mentee?.name : mentor?.name}
              </h3>
              <p className="booking-card-title">
                {userType === 'mentor' ? mentee?.title : mentor?.title}
              </p>
            </div>
          </div>
          
          <div className="booking-card-details">
            <div className="booking-card-detail">
              <span className="booking-card-label">Session Type:</span>
              <span className="booking-card-value">{booking.session_type}</span>
            </div>
            <div className="booking-card-detail">
              <span className="booking-card-label">Topic:</span>
              <span className="booking-card-value">{booking.topic}</span>
            </div>
            {booking.notes && (
              <div className="booking-card-detail">
                <span className="booking-card-label">Notes:</span>
                <span className="booking-card-value">{booking.notes}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="booking-card-actions">
          {activeTab === 'upcoming' && (
            <>
              <button className="booking-card-button primary">
                Join Session
              </button>
              <button 
                className="booking-card-button secondary"
                onClick={() => handleStatusChange(booking.id, 'cancelled')}
              >
                Cancel
              </button>
              <button className="booking-card-button secondary">
                Reschedule
              </button>
            </>
          )}
          
          {activeTab === 'pending' && userType === 'mentor' && (
            <>
              <button 
                className="booking-card-button primary"
                onClick={() => handleStatusChange(booking.id, 'confirmed')}
              >
                Accept
              </button>
              <button 
                className="booking-card-button secondary"
                onClick={() => handleStatusChange(booking.id, 'rejected')}
              >
                Decline
              </button>
            </>
          )}
          
          {activeTab === 'pending' && userType === 'mentee' && (
            <button 
              className="booking-card-button secondary"
              onClick={() => handleStatusChange(booking.id, 'cancelled')}
            >
              Cancel Request
            </button>
          )}
          
          {activeTab === 'past' && (
            <>
              <button className="booking-card-button primary">
                Leave Review
              </button>
              <button className="booking-card-button secondary">
                Book Again
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="booking-management-container">
      <h2 className="booking-management-title">
        {userType === 'mentor' ? 'Manage Your Sessions' : 'Your Mentorship Sessions'}
      </h2>
      
      {renderTabs()}
      
      {loading ? (
        <div className="booking-management-loading">
          <div className="spinner"></div>
          <p>Loading your sessions...</p>
        </div>
      ) : error ? (
        <div className="booking-management-error">
          <p>{error}</p>
          <button 
            className="booking-management-retry"
            onClick={fetchBookings}
          >
            Try Again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="booking-management-empty">
          <svg xmlns="http://www.w3.org/2000/svg" className="empty-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <h3>No {activeTab} sessions found</h3>
          {activeTab === 'upcoming' && userType === 'mentee' && (
            <p>Ready to accelerate your career? Book a session with one of our expert mentors.</p>
          )}
          {activeTab === 'upcoming' && userType === 'mentor' && (
            <p>You don't have any upcoming sessions scheduled. Check your pending requests.</p>
          )}
          {activeTab === 'pending' && userType === 'mentee' && (
            <p>You don't have any pending session requests. Book a session to get started.</p>
          )}
          {activeTab === 'pending' && userType === 'mentor' && (
            <p>You don't have any pending session requests from mentees.</p>
          )}
          {activeTab === 'past' && (
            <p>You don't have any past sessions. Once you complete sessions, they'll appear here.</p>
          )}
          
          {userType === 'mentee' && activeTab !== 'past' && (
            <button className="booking-management-cta">
              Find a Mentor
            </button>
          )}
        </div>
      ) : (
        <div className="booking-management-list">
          {bookings.map(booking => renderBookingCard(booking))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
