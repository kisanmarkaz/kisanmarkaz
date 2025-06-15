import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useConversations } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: conversations, isLoading, error } = useConversations();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">My Messages</h1>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="space-y-4 p-4">
              <div className="animate-pulse flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="animate-pulse flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">My Messages</h1>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center text-red-500">
              Error loading messages. Please try again later.
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Messages</h1>
        
        <div className="bg-white rounded-lg shadow-sm">
          {!conversations || conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No messages yet. Browse listings and message sellers to get started!
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conversation) => {
                const isUserBuyer = user.id === conversation.buyer_id;
                const otherUser = isUserBuyer ? conversation.seller : conversation.buyer;
                
                return (
                  <div
                    key={conversation.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/messages/${conversation.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Listing Image */}
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={conversation.listing?.images?.[0] || '/placeholder.png'}
                          alt={conversation.listing?.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Conversation Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900 truncate">
                            {conversation.listing?.title}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {format(new Date(conversation.updated_at), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {otherUser?.full_name}
                        </p>
                        
                        {conversation.last_message && (
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {conversation.last_message.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages; 