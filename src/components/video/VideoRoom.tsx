import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import './VideoRoom.css';
import { VideoSession } from '@/types/supabase';

interface VideoRoomProps {
  bookingId: string;
  mentorId: string;
  menteeId: string;
  sessionDuration: number;
  onSessionEnd: () => void;
}

const VideoRoom: React.FC<VideoRoomProps> = ({
  bookingId,
  mentorId,
  menteeId,
  sessionDuration,
  onSessionEnd
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  
  const { user } = useAuth();
  
  useEffect(() => {
    fetchSessionDetails();
    initializeMedia();
    
    // Set up timer for session duration
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      // Clean up media streams and connections
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      clearInterval(timer);
    };
  }, [bookingId, mentorId, menteeId]);
  
  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          mentors:mentor_id(*),
          mentees:mentee_id(*)
        `)
        .eq('id', bookingId)
        .single();
        
      if (error) throw error;
      
      setSessionDetails(data);
    } catch (err) {
      console.error('Error fetching session details:', err);
      setError('Failed to load session details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const initializeMedia = async () => {
    try {
      // Request access to user's camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // In a real implementation, this would set up WebRTC connection
      // For demo purposes, we're simulating a connection
      
      setTimeout(() => {
        setConnectionStatus('connected');
        
        // Simulate remote stream (in a real app, this would come from the peer connection)
        setRemoteStream(stream);
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      }, 2000);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to access camera or microphone. Please check your device permissions.');
    }
  };
  
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      
      setIsMuted(!isMuted);
    }
  };
  
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      
      setIsVideoOff(!isVideoOff);
    }
  };
  
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing and revert to camera
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      initializeMedia();
      setIsScreenSharing(false);
    } else {
      try {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        
        if (localStream) {
          // Keep audio tracks from the original stream
          const audioTracks = localStream.getAudioTracks();
          audioTracks.forEach(track => {
            screenStream.addTrack(track);
          });
          
          // Stop video tracks from the original stream
          const videoTracks = localStream.getVideoTracks();
          videoTracks.forEach(track => track.stop());
        }
        
        setLocalStream(screenStream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        
        // Handle the case when user stops screen sharing via the browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
      } catch (err) {
        console.error('Error sharing screen:', err);
        setError('Failed to share screen. Please try again.');
      }
    }
  };
  
  const toggleRecording = () => {
    // In a real implementation, this would start/stop recording
    // For demo purposes, we're just toggling the state
    setIsRecording(!isRecording);
  };
  
  const endSession = async () => {
    try {
      // Update booking status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Clean up media streams
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      if (onSessionEnd) {
        onSessionEnd();
      }
    } catch (err) {
      console.error('Error ending session:', err);
      setError('Failed to end session properly. Please try again.');
    }
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  if (loading && !sessionDetails) {
    return (
      <div className="video-room-loading">
        <div className="spinner"></div>
        <p>Initializing video session...</p>
      </div>
    );
  }
  
  if (error && !sessionDetails) {
    return (
      <div className="video-room-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h3>Session Error</h3>
        <p>{error}</p>
        <button 
          className="video-room-button"
          onClick={fetchSessionDetails}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  const otherUser = userRole === 'mentor' ? sessionDetails?.mentees : sessionDetails?.mentors;
  
  return (
    <div className="video-room">
      <div className="video-room-header">
        <div className="video-room-info">
          <h2 className="video-room-title">
            {sessionDetails?.session_type || 'Mentorship Session'}
          </h2>
          <div className="video-room-meta">
            <div className="video-room-time">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="time-icon">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{formatTime(elapsedTime)}</span>
            </div>
            
            <div className={`video-room-status ${connectionStatus}`}>
              <span className="status-indicator"></span>
              <span className="status-text">
                {connectionStatus === 'connecting' ? 'Connecting...' : 
                 connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="video-room-participants">
          <div className="video-room-participant">
            <img 
              src={otherUser?.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg'} 
              alt={otherUser?.name} 
              className="participant-avatar"
            />
            <span className="participant-name">{otherUser?.name}</span>
          </div>
        </div>
      </div>
      
      <div className="video-room-content">
        <div className="video-room-main">
          <div className="video-room-remote">
            {connectionStatus === 'connected' ? (
              <video 
                ref={remoteVideoRef}
                autoPlay 
                playsInline
                className="remote-video"
              />
            ) : (
              <div className="video-placeholder">
                <div className="spinner"></div>
                <p>Connecting to {otherUser?.name}...</p>
              </div>
            )}
            
            <div className="video-room-remote-info">
              <span className="remote-name">{otherUser?.name}</span>
            </div>
          </div>
          
          <div className="video-room-local">
            <video 
              ref={localVideoRef}
              autoPlay 
              playsInline
              muted
              className="local-video"
            />
            
            <div className="video-room-local-info">
              <span className="local-name">You</span>
              {isMuted && (
                <span className="local-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="video-room-sidebar">
          <div className="video-room-chat">
            <h3 className="sidebar-title">Session Chat</h3>
            
            <div className="chat-messages">
              <div className="chat-message-empty">
                <p>No messages yet. Start the conversation!</p>
              </div>
            </div>
            
            <div className="chat-input">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="chat-input-field"
              />
              <button className="chat-send-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="video-room-notes">
            <h3 className="sidebar-title">Session Notes</h3>
            
            <textarea 
              className="notes-textarea"
              placeholder="Take notes during your session..."
            />
            
            <button className="notes-save-button">
              Save Notes
            </button>
          </div>
        </div>
      </div>
      
      <div className="video-room-controls">
        <button 
          className={`control-button ${isMuted ? 'active' : ''}`}
          onClick={toggleMute}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          )}
          <span className="control-label">{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>
        
        <button 
          className={`control-button ${isVideoOff ? 'active' : ''}`}
          onClick={toggleVideo}
        >
          {isVideoOff ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          )}
          <span className="control-label">{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
        </button>
        
        <button 
          className={`control-button ${isScreenSharing ? 'active' : ''}`}
          onClick={toggleScreenShare}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
          </svg>
          <span className="control-label">{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
        </button>
        
        <button 
          className={`control-button ${isRecording ? 'active' : ''}`}
          onClick={toggleRecording}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          <span className="control-label">{isRecording ? 'Stop Recording' : 'Record'}</span>
        </button>
        
        <button 
          className="control-button end-call"
          onClick={endSession}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            <path d="M16.707 3.293a1 1 0 010 1.414L15.414 6l1.293 1.293a1 1 0 01-1.414 1.414L14 7.414l-1.293 1.293a1 1 0 11-1.414-1.414L12.586 6l-1.293-1.293a1 1 0 011.414-1.414L14 4.586l1.293-1.293a1 1 0 011.414 0z" />
          </svg>
          <span className="control-label">End Session</span>
        </button>
      </div>
    </div>
  );
};

export default VideoRoom;
