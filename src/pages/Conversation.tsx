import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Send } from 'lucide-react';
import { useConversation, useMessages, useSendMessage, useMarkMessageAsRead } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const Conversation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Redirect if no ID
  useEffect(() => {
    if (!id) {
      navigate('/messages');
    }
  }, [id, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const { data: conversation, isLoading: isLoadingConversation, error: conversationError } = useConversation(id || '');
  const { data: messages, isLoading: isLoadingMessages, error: messagesError } = useMessages(id || '');
  const sendMessage = useSendMessage();
  const markAsRead = useMarkMessageAsRead();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (!messages || !user) return;
    
    messages.forEach(msg => {
      if (msg.sender_id !== user.id && !msg.read_at) {
        markAsRead.mutate({ messageId: msg.id });
      }
    });
  }, [messages, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !id) return;

    sendMessage.mutate(
      { conversationId: id, content: message.trim() },
      {
        onSuccess: () => {
          setMessage('');
        },
        onError: (error) => {
          console.error('Error sending message:', error);
        }
      }
    );
  };

  if (!id || !user) {
    return null;
  }

  if (isLoadingConversation || isLoadingMessages) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/messages">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="space-y-4">
              <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
              <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
              <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (conversationError || messagesError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/messages">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>Error loading conversation</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!conversation) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/messages">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>Conversation not found</div>
          </div>
        </div>
      </Layout>
    );
  }

  const isUserBuyer = user.id === conversation.buyer_id;
  const otherUser = isUserBuyer ? conversation.seller : conversation.buyer;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/messages">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">{conversation.listing?.title}</h1>
            <p className="text-sm text-gray-600">{otherUser?.full_name}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="h-[calc(100vh-400px)] overflow-y-auto p-4">
            <div className="space-y-4">
              {messages?.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages?.map((msg) => {
                  const isOwnMessage = msg.sender_id === user.id;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isOwnMessage
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-foreground/80' : 'text-gray-500'}`}>
                          {format(new Date(msg.created_at), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button 
                type="submit" 
                disabled={!message.trim() || sendMessage.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Conversation; 