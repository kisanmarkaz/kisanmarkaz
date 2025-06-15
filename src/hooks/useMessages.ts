import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Message, Conversation } from '@/types/message';
import { useAuth } from './useAuth';

export const useConversations = () => {
  const { user } = useAuth();

  return useQuery<Conversation[]>({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      try {
        // First get conversations
        const { data: conversations, error: conversationsError } = await supabase
          .from('conversations')
          .select(`
            *,
            listing:listings(id, title, images),
            last_message:messages(*)
          `)
          .or('buyer_id.eq.' + user.id + ',seller_id.eq.' + user.id)
          .order('updated_at', { ascending: false });

        if (conversationsError) {
          console.error('Error fetching conversations:', conversationsError);
          throw conversationsError;
        }
        
        if (!conversations) {
          console.log('No conversations found');
          return [];
        }

        // Get unique user IDs
        const userIds = [...new Set(conversations.flatMap(c => [c.buyer_id, c.seller_id]))];
        console.log('Fetching data for users:', userIds);

        // Fetch user data from user_profiles view
        const { data: users, error: usersError } = await supabase
          .from('user_profiles')
          .select('id, email, raw_user_meta_data')
          .in('id', userIds);

        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw usersError;
        }

        console.log('Received user data:', users);

        interface UserData {
          id: string;
          email: string;
          raw_user_meta_data: { full_name?: string };
        }

        interface UserMap {
          [key: string]: { id: string; full_name: string };
        }

        // Create a map of user data
        const userMap = (users || []).reduce((acc: UserMap, user: UserData) => {
          acc[user.id] = {
            id: user.id,
            full_name: user.raw_user_meta_data?.full_name || user.email
          };
          return acc;
        }, {});

        console.log('Created user map:', userMap);

        // Transform conversations with user data
        const result = conversations.map(conversation => ({
          ...conversation,
          buyer: userMap[conversation.buyer_id] || null,
          seller: userMap[conversation.seller_id] || null
        }));

        console.log('Final conversations data:', result);
        return result;
      } catch (error) {
        console.error('Detailed error in useConversations:', error);
        throw error;
      }
    },
    enabled: !!user
  });
};

export const useConversation = (conversationId: string) => {
  return useQuery<Conversation>({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      try {
        // First get the conversation
        const { data: conversation, error: conversationError } = await supabase
          .from('conversations')
          .select(`
            *,
            listing:listings(id, title, images)
          `)
          .eq('id', conversationId)
          .single();

        if (conversationError) {
          console.error('Error fetching conversation:', conversationError);
          throw conversationError;
        }
        
        if (!conversation) {
          console.log('No conversation found with ID:', conversationId);
          return null;
        }

        console.log('Fetching data for users:', [conversation.buyer_id, conversation.seller_id]);

        // Fetch user data from user_profiles view
        const { data: users, error: usersError } = await supabase
          .from('user_profiles')
          .select('id, email, raw_user_meta_data')
          .in('id', [conversation.buyer_id, conversation.seller_id]);

        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw usersError;
        }

        console.log('Received user data:', users);

        interface UserData {
          id: string;
          email: string;
          raw_user_meta_data: { full_name?: string };
        }

        interface UserMap {
          [key: string]: { id: string; full_name: string };
        }

        // Create a map of user data
        const userMap = (users || []).reduce((acc: UserMap, user: UserData) => {
          acc[user.id] = {
            id: user.id,
            full_name: user.raw_user_meta_data?.full_name || user.email
          };
          return acc;
        }, {});

        console.log('Created user map:', userMap);

        // Return conversation with user data
        const result = {
          ...conversation,
          buyer: userMap[conversation.buyer_id] || null,
          seller: userMap[conversation.seller_id] || null
        };

        console.log('Final conversation data:', result);
        return result;
      } catch (error) {
        console.error('Detailed error in useConversation:', error);
        throw error;
      }
    },
    enabled: !!conversationId
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!conversationId
  });
};

export const useStartConversation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ listingId, sellerId }: { listingId: string; sellerId: string }) => {
      // First check if a conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', user?.id)
        .eq('seller_id', sellerId)
        .single();

      if (existingConversation) {
        return existingConversation;
      }

      // If no conversation exists, create a new one
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          listing_id: listingId,
          buyer_id: user?.id,
          seller_id: sellerId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user?.id,
          content
        })
        .select()
        .single();

      if (error) throw error;

      // Update the conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const { data, error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
}; 