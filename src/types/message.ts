export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  listing?: {
    id: string;
    title: string;
    images?: string[];
  };
  buyer?: {
    id: string;
    full_name: string;
  };
  seller?: {
    id: string;
    full_name: string;
  };
  last_message?: Message;
} 