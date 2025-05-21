import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import './NotificationCenter.css';

interface NotificationCenterProps {
  userId: string;
}

// Define notification type
interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  created_at: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Commented out the real-time subscription since the 'notifications' table doesn't exist yet
    // We'll use mock data instead for now
    
    /*
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('public:notifications')
      .on('INSERT', payload => {
        setNotifications(currentNotifications => [payload.new, ...currentNotifications]);
        setUnreadCount(count => count + 1);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
    */
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');

      // Since the 'notifications' table doesn't exist, we'll use mock data
      // This would be the real query once the table exists:
      /*
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
      */
      
      // Mock data for development
      const mockNotifications: Notification[] = [
        {
          id: '1',
          user_id: userId,
          message: 'Your booking with Jane Smith has been confirmed',
          type: 'booking',
          read: false,
          link: '/bookings/1',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min ago
        },
        {
          id: '2',
          user_id: userId,
          message: 'You received a new message from John Doe',
          type: 'message',
          read: true,
          link: '/messaging',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
        },
        {
          id: '3',
          user_id: userId,
          message: 'Payment for your session with John Doe was successful',
          type: 'payment',
          read: false,
          link: '/payments',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
        }
      ];
      
      setNotifications(mockNotifications);
      
      // Count unread notifications
      const unread = mockNotifications.filter(notification => !notification.read).length || 0;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Since the 'notifications' table doesn't exist yet, we'll just update local state
      // This would be the real update once the table exists:
      /*
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      */
      
      // Update local state
      setNotifications(currentNotifications => 
        currentNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(count => Math.max(0, count - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(notification => !notification.read)
        .map(notification => notification.id);
      
      if (unreadIds.length === 0) return;
      
      // Since the 'notifications' table doesn't exist yet, we'll just update local state
      // This would be the real update once the table exists:
      /*
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds);

      if (error) throw error;
      */
      
      // Update local state
      setNotifications(currentNotifications => 
        currentNotifications.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="notification-icon booking" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        );
      case 'message':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="notification-icon message" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        );
      case 'payment':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="notification-icon payment" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        );
      case 'review':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="notification-icon review" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="notification-icon default" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
    }
  };

  const toggleNotificationCenter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="notification-center">
      <button 
        className="notification-button"
        onClick={toggleNotificationCenter}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3 className="notification-title">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="notification-mark-all"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="notification-content">
            {loading && notifications.length === 0 ? (
              <div className="notification-loading">
                <div className="spinner"></div>
                <p>Loading notifications...</p>
              </div>
            ) : error && notifications.length === 0 ? (
              <div className="notification-error">
                <p>{error}</p>
                <button 
                  className="notification-retry"
                  onClick={fetchNotifications}
                >
                  Try Again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <svg xmlns="http://www.w3.org/2000/svg" className="empty-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => {
                      if (!notification.read) {
                        handleMarkAsRead(notification.id);
                      }
                      // Handle navigation based on notification type and link
                      if (notification.link) {
                        window.location.href = notification.link;
                      }
                    }}
                  >
                    <div className="notification-icon-container">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="notification-details">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{formatTime(notification.created_at)}</span>
                    </div>
                    
                    {!notification.read && (
                      <div className="notification-unread-indicator"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="notification-footer">
            <a href="/notifications" className="notification-view-all">
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
