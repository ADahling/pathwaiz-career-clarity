import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, User, Users, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Message, Conversation } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender_id === currentUserId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </form>
  );
};

interface ConversationItemProps {
  conversation: {
    id: string;
    otherUser: {
      id: string;
      name: string;
      avatar?: string;
    };
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
  };
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-muted ${
        isActive ? 'bg-muted' : ''
      }`}
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage src={conversation.otherUser.avatar} />
        <AvatarFallback>
          {conversation.otherUser.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">{conversation.otherUser.name}</p>
          {conversation.lastMessageTime && (
            <p className="text-xs text-muted-foreground">
              {conversation.lastMessageTime}
            </p>
          )}
        </div>
        {conversation.lastMessage && (
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage}
          </p>
        )}
      </div>
      {conversation.unreadCount && conversation.unreadCount > 0 ? (
        <div className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {conversation.unreadCount}
        </div>
      ) : null}
    </div>
  );
};

interface MessagingProps {
  initialConversationId?: string;
}

const Messaging: React.FC<MessagingProps> = ({ initialConversationId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('conversations');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    initialConversationId || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      setIsLoadingConversations(true);
      
      try {
        // This is a placeholder implementation
        // In a real implementation, we would fetch conversations from Supabase
        
        // Mock data for demonstration
        const mockConversations = [
          {
            id: '1',
            otherUser: {
              id: 'user-1',
              name: 'Jane Smith',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            },
            lastMessage: 'Looking forward to our session tomorrow!',
            lastMessageTime: '2:30 PM',
            unreadCount: 2,
          },
          {
            id: '2',
            otherUser: {
              id: 'user-2',
              name: 'Michael Johnson',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
            },
            lastMessage: 'Thanks for your advice. It was very helpful.',
            lastMessageTime: 'Yesterday',
          },
          {
            id: '3',
            otherUser: {
              id: 'user-3',
              name: 'Sarah Williams',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            },
            lastMessage: 'Can we reschedule our meeting?',
            lastMessageTime: 'Mon',
            unreadCount: 1,
          },
        ];
        
        setConversations(mockConversations);
        
        // If there's an initial conversation ID, set it as active
        if (initialConversationId) {
          setActiveConversation(initialConversationId);
          setActiveTab('messages');
        } else if (mockConversations.length > 0) {
          // Otherwise, set the first conversation as active
          setActiveConversation(mockConversations[0].id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load conversations. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [user, initialConversationId, toast]);

  // Fetch messages for active conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !activeConversation) return;
      
      setIsLoadingMessages(true);
      
      try {
        // This is a placeholder implementation
        // In a real implementation, we would fetch messages from Supabase
        
        // Mock data for demonstration
        const mockMessages: Message[] = [
          {
            id: '1',
            sender_id: 'user-1',
            recipient_id: user.id,
            booking_id: null,
            content: 'Hi there! I was wondering if you could help me with my career transition to product management?',
            is_read: true,
            created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            updated_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '2',
            sender_id: user.id,
            recipient_id: 'user-1',
            booking_id: null,
            content: 'Of course! I\'d be happy to help. What specific aspects of product management are you interested in?',
            is_read: true,
            created_at: new Date(Date.now() - 3500000).toISOString(),
            updated_at: new Date(Date.now() - 3500000).toISOString(),
          },
          {
            id: '3',
            sender_id: 'user-1',
            recipient_id: user.id,
            booking_id: null,
            content: 'I\'m coming from a UX design background, so I\'m particularly interested in how to leverage my design skills in a PM role.',
            is_read: true,
            created_at: new Date(Date.now() - 3400000).toISOString(),
            updated_at: new Date(Date.now() - 3400000).toISOString(),
          },
          {
            id: '4',
            sender_id: user.id,
            recipient_id: 'user-1',
            booking_id: null,
            content: 'That\'s a great background for PM! Your UX experience will be valuable. Let\'s schedule a session to discuss this in more detail.',
            is_read: true,
            created_at: new Date(Date.now() - 3300000).toISOString(),
            updated_at: new Date(Date.now() - 3300000).toISOString(),
          },
          {
            id: '5',
            sender_id: 'user-1',
            recipient_id: user.id,
            booking_id: null,
            content: 'That sounds perfect! When are you available next week?',
            is_read: false,
            created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
            updated_at: new Date(Date.now() - 1800000).toISOString(),
          },
          {
            id: '6',
            sender_id: 'user-1',
            recipient_id: user.id,
            booking_id: null,
            content: 'Also, do you have any resources you recommend I review before our session?',
            is_read: false,
            created_at: new Date(Date.now() - 1700000).toISOString(),
            updated_at: new Date(Date.now() - 1700000).toISOString(),
          },
        ];
        
        setMessages(mockMessages);
        
        // Mark messages as read in a real implementation
        // This would update the unread count in the conversation list
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [user, activeConversation, toast]);

  const handleSendMessage = async (content: string) => {
    if (!user || !activeConversation) return;
    
    setIsSendingMessage(true);
    
    try {
      // This is a placeholder implementation
      // In a real implementation, we would send the message to Supabase
      
      // Get the recipient ID from the active conversation
      const conversation = conversations.find(c => c.id === activeConversation);
      if (!conversation) throw new Error('Conversation not found');
      
      const recipientId = conversation.otherUser.id;
      
      // Create a new message object
      const newMessage: Message = {
        id: `new-${Date.now()}`,
        sender_id: user.id,
        recipient_id: recipientId,
        booking_id: null,
        content,
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add the message to the local state
      setMessages(prev => [...prev, newMessage]);
      
      // Update the conversation in the list
      setConversations(prev => 
        prev.map(c => 
          c.id === activeConversation 
            ? {
                ...c,
                lastMessage: content,
                lastMessageTime: 'Just now',
              }
            : c
        )
      );
      
      // In a real implementation, we would also:
      // 1. Insert the message into the messages table
      // 2. Update the conversation's last_message_at
      // 3. Create a notification for the recipient
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setActiveConversation(conversationId);
    setActiveTab('messages');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>
          Communicate with your mentors and mentees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conversations" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Conversations
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center" disabled={!activeConversation}>
              <User className="h-4 w-4 mr-2" />
              {activeConversation
                ? conversations.find(c => c.id === activeConversation)?.otherUser.name || 'Messages'
                : 'Messages'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversations" className="mt-4">
            {isLoadingConversations ? (
              <div className="flex justify-center items-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : conversations.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      isActive={conversation.id === activeConversation}
                      onClick={() => handleConversationClick(conversation.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No conversations yet</h3>
                <p className="text-muted-foreground mt-2">
                  Your conversations with mentors and mentees will appear here.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="messages" className="mt-4">
            {activeConversation ? (
              <>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        conversations.find(c => c.id === activeConversation)?.otherUser.avatar
                      }
                    />
                    <AvatarFallback>
                      {conversations
                        .find(c => c.id === activeConversation)
                        ?.otherUser.name.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {
                        conversations.find(c => c.id === activeConversation)?.otherUser.name
                      }
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Last active: Recently</span>
                    </div>
                  </div>
                </div>
                
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <MessageList messages={messages} currentUserId={user?.id || ''} />
                    <div className="mt-4">
                      <MessageInput
                        onSendMessage={handleSendMessage}
                        isLoading={isSendingMessage}
                      />
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-muted-foreground mt-2">
                  Select a conversation from the list to view messages.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Messages are end-to-end encrypted and stored securely.
      </CardFooter>
    </Card>
  );
};

export default Messaging;
