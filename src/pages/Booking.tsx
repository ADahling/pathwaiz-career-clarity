import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import BookingForm from '../../components/booking/BookingForm';
import './Booking.css';

const Booking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get mentor ID from URL
  const mentorId = window.location.pathname.split('/').pop();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    const fetchMentor = async () => {
      try {
        setLoading(true);
        
        // Fetch mentor data from Supabase
        const { data, error } = await supabase
          .from('mentors')
          .select('*, profiles(*)')
          .eq('id', mentorId)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          // If no data, use placeholder for development
          setMentor({
            id: mentorId,
            name: 'Alex Johnson',
            title: 'Senior Product Manager',
            company: 'Tech Innovations Inc.',
            bio: 'Experienced product leader with 10+ years in tech. Passionate about mentoring the next generation of product managers and helping them navigate their career paths.',
            expertise: ['Product Strategy', 'Career Transitions', 'Leadership', 'UX Design'],
            hourlyRate: 75,
            rating: 4.8,
            reviewCount: 24,
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            availability: [
              { day: 'Monday', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
              { day: 'Wednesday', slots: ['11:00 AM', '3:00 PM'] },
              { day: 'Friday', slots: ['9:00 AM', '1:00 PM', '5:00 PM'] }
            ]
          });
        } else {
          setMentor(data);
        }
      } catch (error) {
        console.error('Error fetching mentor:', error);
        setError('Failed to load mentor information. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMentor();
  }, [user, mentorId, navigate]);
  
  if (loading) {
    return (
      <div className="booking-page-loading">
        <div className="spinner"></div>
        <p>Loading booking information...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="booking-page-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button 
          className="booking-page-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!mentor) {
    return (
      <div className="booking-page-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h2>Mentor Not Found</h2>
        <p>We couldn't find the mentor you're looking for.</p>
        <button 
          className="booking-page-button"
          onClick={() => navigate('/find-a-mentor')}
        >
          Browse Mentors
        </button>
      </div>
    );
  }
  
  return (
    <div className="booking-page">
      <div className="booking-page-header">
        <div className="booking-page-mentor-info">
          <img 
            src={mentor.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'} 
            alt={mentor.name} 
            className="booking-page-mentor-image"
          />
          <div>
            <h1 className="booking-page-title">Book a Session with {mentor.name}</h1>
            <p className="booking-page-subtitle">{mentor.title} at {mentor.company}</p>
          </div>
        </div>
        <button 
          className="booking-page-back-button"
          onClick={() => navigate(`/mentor/${mentorId}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Profile
        </button>
      </div>
      
      <div className="booking-page-content">
        <BookingForm 
          mentor={mentor} 
          onClose={() => navigate(`/mentor/${mentorId}`)}
        />
      </div>
    </div>
  );
};

export default Booking;
