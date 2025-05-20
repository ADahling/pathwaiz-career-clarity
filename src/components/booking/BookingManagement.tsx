import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './BookingManagement.css';

const BookingManagement = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');

        // Fetch bookings from Supabase
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            mentors:mentor_id (
              id, 
              profiles:profile_id (
                full_name, 
                avatar_url
              )
            )
          `)
          .eq('mentee_id', user.id)
          .order('date', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
          // Use placeholder data for development
          const placeholderData = generatePlaceholderBookings();
          setBookings(placeholderData);
        } else {
          setBookings(data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load your bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const generatePlaceholderBookings = () => {
    const today = new Date();
    const placeholderBookings = [];

    // Generate upcoming bookings
    for (let i = 1; i <= 3; i++) {
      const bookingDate = new Date(today);
      bookingDate.setDate(today.getDate() + i * 3);
      
      placeholderBookings.push({
        id: `upcoming-${i}`,
        mentee_id: user?.id,
        mentor_id: `mentor-${i}`,
        date: bookingDate.toISOString().split('T')[0],
        time: i % 2 === 0 ? '10:00' : '14:00',
        session_type: ['Career Guidance', 'Resume Review', 'Interview Preparation'][i - 1],
        topic: [
          'Transitioning to product management',
          'Feedback on my UX portfolio',
          'Preparing for senior developer interviews'
        ][i - 1],
        status: 'confirmed',
        created_at: new Date().toISOString(),
        mentors: {
          id: `mentor-${i}`,
          profiles: {
            full_name: ['Alex Johnson', 'Sarah Williams', 'Michael Chen'][i - 1],
            avatar_url: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${20 + i}.jpg`
          }
        }
      });
    }

    // Generate past bookings
    for (let i = 1; i <= 2; i++) {
      const bookingDate = new Date(today);
      bookingDate.setDate(today.getDate() - i * 7);
      
      placeholderBookings.push({
        id: `past-${i}`,
        mentee_id: user?.id,
        mentor_id: `mentor-${i + 3}`,
        date: bookingDate.toISOString().split('T')[0],
        time: i % 2 === 0 ? '11:00' : '15:00',
        session_type: ['Skill Development', 'Career Strategy'][i - 1],
        topic: [
          'Learning React best practices',
          'Creating a 5-year career plan'
        ][i - 1],
        status: 'completed',
        created_at: new Date(bookingDate).toISOString(),
        feedback_submitted: i === 1,
        mentors: {
          id: `mentor-${i + 3}`,
          profiles: {
            full_name: ['David Kim', 'Emily Rodriguez'][i - 1],
            avatar_url: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${30 + i}.jpg`
          }
        }
      });
    }

    return placeholderBookings;
  };

  const filterBookings = (status) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (status === 'upcoming') {
      return bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= today && booking.status !== 'cancelled';
      });
    } else if (status === 'past') {
      return bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate < today || booking.status === 'completed';
      });
    } else if (status === 'cancelled') {
      return bookings.filter(booking => booking.status === 'cancelled');
    }

    return [];
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setLoading(true);
      
      // Update booking status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );

    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderBookingCard = (booking) => {
    const bookingDate = new Date(booking.date);
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const isPast = bookingDate < new Date();
    const isToday = bookingDate.toDateString() === new Date().toDateString();
    
    const getStatusBadgeClass = () => {
      if (booking.status === 'cancelled') return 'status-cancelled';
      if (booking.status === 'completed') return 'status-completed';
      if (isToday) return 'status-today';
      return 'status-upcoming';
    };

    const getStatusText = () => {
      if (booking.status === 'cancelled') return 'Cancelled';
      if (booking.status === 'completed') return 'Completed';
      if (isToday) return 'Today';
      return 'Upcoming';
    };

    return (
      <div key={booking.id} className="booking-card">
        <div className="booking-card-header">
          <div className="booking-mentor-info">
            <img 
              src={booking.mentors?.profiles?.avatar_url || 'https://randomuser.me/api/portraits/men/1.jpg'} 
              alt={booking.mentors?.profiles?.full_name || 'Mentor'} 
              className="booking-mentor-avatar"
            />
            <div>
              <h3 className="booking-mentor-name">{booking.mentors?.profiles?.full_name || 'Mentor Name'}</h3>
              <p className="booking-session-type">{booking.session_type}</p>
            </div>
          </div>
          <div className={`booking-status-badge ${getStatusBadgeClass()}`}>
            {getStatusText()}
          </div>
        </div>
        
        <div className="booking-card-details">
          <div className="booking-detail-item">
            <svg xmlns="http://www.w3.org/2000/svg" className="booking-detail-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{formattedDate}</span>
          </div>
          
          <div className="booking-detail-item">
            <svg xmlns="http://www.w3.org/2000/svg" className="booking-detail-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{booking.time}</span>
          </div>
          
          <div className="booking-detail-item booking-topic">
            <svg xmlns="http://www.w3.org/2000/svg" className="booking-detail-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>{booking.topic}</span>
          </div>
        </div>
        
        <div className="booking-card-actions">
          {!isPast && booking.status !== 'cancelled' && (
            <>
              <button 
                className="booking-action-button secondary"
                onClick={() => handleCancelBooking(booking.id)}
              >
                Cancel
              </button>
              <Link 
                to={`/reschedule/${booking.id}`}
                className="booking-action-button secondary"
              >
                Reschedule
              </Link>
            </>
          )}
          
          {isPast && booking.status !== 'cancelled' && !booking.feedback_submitted && (
            <Link 
              to={`/feedback/${booking.id}`}
              className="booking-action-button primary"
            >
              Leave Feedback
            </Link>
          )}
          
          {isToday && booking.status !== 'cancelled' && (
            <Link 
              to={`/session/${booking.id}`}
              className="booking-action-button primary"
            >
              Join Session
            </Link>
          )}
          
          {!isPast && booking.status !== 'cancelled' && (
            <Link 
              to={`/messages/${booking.mentor_id}`}
              className="booking-action-button secondary"
            >
              Message
            </Link>
          )}
        </div>
      </div>
    );
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="booking-management-loading">
        <div className="spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="booking-management">
      <div className="booking-management-header">
        <h1 className="booking-management-title">My Sessions</h1>
        <Link to="/find-a-mentor" className="booking-new-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="booking-new-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Book New Session
        </Link>
      </div>
      
      <div className="booking-management-tabs">
        <button 
          className={`booking-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`booking-tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
        <button 
          className={`booking-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
      </div>
      
      {error && (
        <div className="booking-management-error">
          <p>{error}</p>
          <button 
            className="booking-retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="booking-list">
        {filterBookings(activeTab).length > 0 ? (
          filterBookings(activeTab).map(booking => renderBookingCard(booking))
        ) : (
          <div className="booking-empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" className="booking-empty-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <h3>No {activeTab} sessions</h3>
            {activeTab === 'upcoming' && (
              <p>You don't have any upcoming sessions scheduled. Book a session with a mentor to get started.</p>
            )}
            {activeTab === 'past' && (
              <p>You don't have any past sessions. Once you complete sessions, they will appear here.</p>
            )}
            {activeTab === 'cancelled' && (
              <p>You don't have any cancelled sessions.</p>
            )}
            {activeTab === 'upcoming' && (
              <Link to="/find-a-mentor" className="booking-empty-button">
                Find a Mentor
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
