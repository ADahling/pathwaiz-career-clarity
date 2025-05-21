
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Messaging from '@/components/messaging/Messaging';
import './MessagingPage.css';

const MessagingPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="messaging-page">
      <div className="messaging-page-header">
        <h1 className="messaging-page-title">Messages</h1>
        <p className="messaging-page-subtitle">
          Connect with your mentors and mentees through real-time messaging
        </p>
      </div>
      
      <div className="messaging-page-content">
        <Messaging initialConversationId={conversationId} />
      </div>
      
      <div className="messaging-page-tips">
        <div className="tip-card">
          <div className="tip-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div className="tip-content">
            <h3>Messaging Tips</h3>
            <ul>
              <li>Be specific about your questions and goals</li>
              <li>Share relevant files or images to provide context</li>
              <li>Respect your mentor's time and expertise</li>
              <li>Follow up on advice and share your progress</li>
            </ul>
          </div>
        </div>
        
        <div className="tip-card">
          <div className="tip-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="tip-content">
            <h3>Getting the Most from Mentorship</h3>
            <ul>
              <li>Come prepared with specific questions</li>
              <li>Take notes during your sessions</li>
              <li>Set clear goals and track your progress</li>
              <li>Schedule regular follow-up sessions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
