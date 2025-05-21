import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import './Messaging.css';
import { Message, Conversation } from '@/types/supabase';

interface MessagingProps {
  userId: string;
  recipientId?: string;
}

const Messaging: React.FC<MessagingProps> = ({ userId, recipientId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  useEffect(() => {
    if (recipientId) {
      const conversation = conversations.find(
        conv => conv.recipient_id === recipientId || conv.sender_id === recipientId
      );
      
      if (conversation) {
        setActiveConversation(conversation);
      } else {
        // Create a new conversation object
        setActiveConversation({
          id: 'new',
          recipient_id: recipientId,
          sender_id: userId,
          created_at: new Date().toISOString()
        });
      }
    } else if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [recipientId, conversations, userId, activeConversation]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      
      // Set up real-time subscription for new messages
      const subscription = supabase
        .channel(`messages:conversation_id=eq.${activeConversation.id}`)
        .on('INSERT', payload => {
          setMessages(currentMessages => [...currentMessages, payload.new]);
        })
        .subscribe();
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [activeConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch conversations where user is either sender or recipient
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          sender:sender_id(*),
          recipient:recipient_id(*)
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setConversations(data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    if (conversationId === 'new') return;
    
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      
      // Mark messages as read
      if (data && data.length > 0) {
        const unreadMessages = data.filter(
          msg => msg.recipient_id === userId && !msg.read
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    try {
      setSending(true);
      
      let conversationId = activeConversation.id;
      
      // If this is a new conversation, create it first
      if (conversationId === 'new') {
        const { data, error } = await supabase
          .from('conversations')
          .insert([
            {
              sender_id: userId,
              recipient_id: activeConversation.recipient_id,
              last_message: newMessage,
              updated_at: new Date().toISOString()
            }
          ])
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          conversationId = data[0].id;
          setActiveConversation({ ...data[0] });
          setConversations([...conversations, data[0]]);
        }
      } else {
        // Update conversation with last message
        await supabase
          .from('conversations')
          .update({
            last_message: newMessage,
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);
      }
      
      // Send the message
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: userId,
            recipient_id: activeConversation.sender_id === userId 
              ? activeConversation.recipient_id 
              : activeConversation.sender_id,
            content: newMessage,
            created_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) throw error;
      
      if (data) {
        setMessages([...messages, ...data]);
      }
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getOtherUser = (conversation: any) => {
    if (!conversation) return null;
    
    return conversation.sender_id === userId 
      ? conversation.recipient 
      : conversation.sender;
  };

  const renderConversationList = () => {
    if (loading && conversations.length === 0) {
      return (
        <div className="messaging-loading">
          <div className="spinner"></div>
          <p>Loading conversations...</p>
        </div>
      );
    }
    
    if (error && conversations.length === 0) {
      return (
        <div className="messaging-error">
          <p>{error}</p>
          <button 
            className="messaging-retry"
            onClick={fetchConversations}
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (conversations.length === 0) {
      return (
        <div className="messaging-empty">
          <svg xmlns="http://www.w3.org/2000/svg" className="empty-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <h3>No conversations yet</h3>
          <p>Start a conversation with a mentor or mentee to get help with your career journey.</p>
        </div>
      );
    }
    
    return (
      <div className="conversation-list">
        {conversations.map(conversation => {
          const otherUser = getOtherUser(conversation);
          if (!otherUser) return null;
          
          return (
            <div 
              key={conversation.id}
              className={`conversation-item ${activeConversation?.id === conversation.id ? 'active' : ''}`}
              onClick={() => setActiveConversation(conversation)}
            >
              <div className="conversation-avatar">
                <img 
                  src={otherUser.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                  alt={otherUser.name}
                />
                <div className="conversation-status online"></div>
              </div>
              
              <div className="conversation-content">
                <div className="conversation-header">
                  <h3 className="conversation-name">{otherUser.name}</h3>
                  <span className="conversation-time">
                    {formatDate(conversation.updated_at)}
                  </span>
                </div>
                
                <div className="conversation-preview">
                  <p className="conversation-last-message">
                    {conversation.last_message}
                  </p>
                  
                  {conversation.unread_count > 0 && (
                    <div className="conversation-unread">
                      {conversation.unread_count}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMessageArea = () => {
    if (!activeConversation) {
      return (
        <div className="message-area-empty">
          <svg xmlns="http://www.w3.org/2000/svg" className="empty-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <h3>Select a conversation</h3>
          <p>Choose a conversation from the list to start messaging.</p>
        </div>
      );
    }
    
    const otherUser = getOtherUser(activeConversation);
    
    return (
      <div className="message-area">
        <div className="message-header">
          <div className="message-header-user">
            <img 
              src={otherUser?.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg'} 
              alt={otherUser?.name} 
              className="message-header-avatar"
            />
            <div className="message-header-info">
              <h3 className="message-header-name">{otherUser?.name}</h3>
              <p className="message-header-status">
                <span className="status-indicator online"></span>
                Online
              </p>
            </div>
          </div>
          
          <div className="message-header-actions">
            <button className="message-header-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <span>Video Call</span>
            </button>
            
            <button className="message-header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="message-content">
          {loading && messages.length === 0 ? (
            <div className="message-loading">
              <div className="spinner"></div>
              <p>Loading messages...</p>
            </div>
          ) : error && messages.length === 0 ? (
            <div className="message-error">
              <p>{error}</p>
              <button 
                className="message-retry"
                onClick={() => fetchMessages(activeConversation.id)}
              >
                Try Again
              </button>
            </div>
          ) : messages.length === 0 && activeConversation.id !== 'new' ? (
            <div className="message-empty">
              <svg xmlns="http://www.w3.org/2000/svg" className="empty-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <h3>No messages yet</h3>
              <p>Start the conversation by sending a message below.</p>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message, index) => {
                const isCurrentUser = message.sender_id === userId;
                const showDate = index === 0 || 
                  formatDate(messages[index - 1].created_at) !== formatDate(message.created_at);
                
                return (
                  <React.Fragment key={message.id}>
                    {showDate && (
                      <div className="message-date">
                        <span>{formatDate(message.created_at)}</span>
                      </div>
                    )}
                    
                    <div className={`message-bubble ${isCurrentUser ? 'sent' : 'received'}`}>
                      {!isCurrentUser && (
                        <img 
                          src={otherUser?.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                          alt={otherUser?.name} 
                          className="message-avatar"
                        />
                      )}
                      
                      <div className="message-bubble-content">
                        <div className="message-text">
                          {message.content}
                        </div>
                        <div className="message-time">
                          {formatTime(message.created_at)}
                          {isCurrentUser && (
                            <span className="message-status">
                              {message.read ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="read-icon">
                                  <path d="M9.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 8.586l-2.293-2.293z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="sent-icon">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              
              {activeConversation.id === 'new' && (
                <div className="message-empty">
                  <svg xmlns="http://www.w3.org/2000/svg" className="empty-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <h3>New Conversation</h3>
                  <p>Start the conversation by sending a message below.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="message-input">
          <div className="message-input-actions">
            <button className="message-input-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button className="message-input-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="message-input-field">
            <textarea
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          
          <button 
            className="message-send-button"
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
          >
            {sending ? (
              <div className="spinner small"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="messaging-container">
      <div className="messaging-sidebar">
        <div className="messaging-header">
          <h2 className="messaging-title">Messages</h2>
          <button className="messaging-new-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="messaging-search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="search-icon">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="messaging-search-input"
          />
        </div>
        
        {renderConversationList()}
      </div>
      
      {renderMessageArea()}
    </div>
  );
};

export default Messaging;
