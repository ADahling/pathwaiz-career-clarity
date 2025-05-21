import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import VideoRoom from '@/components/video/VideoRoom';
import './VideoSessionPage.css';

const VideoSessionPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessionEnded, setSessionEnded] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, navigate]);

  // Mock booking data - in a real implementation, this would be fetched from Supabase
  const mockBooking = {
    id: bookingId || 'booking-123',
    mentorId: 'mentor-456',
    menteeId: user?.id || 'mentee-789',
    sessionDuration: 30, // minutes
    sessionType: '30 min Deep Dive',
    sessionTopic: 'Career Transition Strategy',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 5).toISOString() // 5 minutes from now
  };

  const handleSessionEnd = () => {
    setSessionEnded(true);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="video-session-page">
      <div className="video-session-header">
        <h1 className="video-session-title">Video Session</h1>
        <p className="video-session-subtitle">
          {sessionEnded ? 'Your session has ended' : 'Connect with your mentor/mentee through video'}
        </p>
      </div>
      
      <div className="video-session-content">
        {sessionEnded ? (
          <div className="session-ended-container">
            <div className="session-ended-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>Session Completed</h2>
            <p>Your video session has ended. We hope it was productive!</p>
            <div className="session-ended-actions">
              <button 
                className="primary-button"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </button>
              <button 
                className="secondary-button"
                onClick={() => navigate('/booking')}
              >
                Book Another Session
              </button>
            </div>
          </div>
        ) : (
          <VideoRoom
            bookingId={mockBooking.id}
            mentorId={mockBooking.mentorId}
            menteeId={mockBooking.menteeId}
            sessionDuration={mockBooking.sessionDuration}
            onSessionEnd={handleSessionEnd}
          />
        )}
      </div>
      
      {!sessionEnded && (
        <div className="video-session-info">
          <div className="info-card">
            <div className="info-card-header">
              <h3>Session Details</h3>
            </div>
            <div className="info-card-content">
              <div className="info-item">
                <div className="info-label">Type:</div>
                <div className="info-value">{mockBooking.sessionType}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Topic:</div>
                <div className="info-value">{mockBooking.sessionTopic}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Duration:</div>
                <div className="info-value">{mockBooking.sessionDuration} minutes</div>
              </div>
              <div className="info-item">
                <div className="info-label">Scheduled:</div>
                <div className="info-value">{new Date(mockBooking.scheduledTime).toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div className="info-card">
            <div className="info-card-header">
              <h3>Tips for a Great Session</h3>
            </div>
            <div className="info-card-content">
              <ul className="tips-list">
                <li>Use headphones for better audio quality</li>
                <li>Find a quiet place with good lighting</li>
                <li>Have your questions prepared in advance</li>
                <li>Take notes during the session</li>
                <li>Be respectful of the time limit</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSessionPage;
