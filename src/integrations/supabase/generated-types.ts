export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      category_fields: {
        Row: {
          category_id: string | null
          created_at: string | null
          field_label: string
          field_name: string
          field_options: Json | null
          field_type: string
          id: string
          required: boolean | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          field_label: string
          field_name: string
          field_options?: Json | null
          field_type: string
          id?: string
          required?: boolean | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          field_label?: string
          field_name?: string
          field_options?: Json | null
          field_type?: string
          id?: string
          required?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_fields_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          buyer_id: string
          created_at: string | null
          id: string
          listing_id: string
          seller_id: string
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          id?: string
          listing_id: string
          seller_id: string
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          id?: string
          listing_id?: string
          seller_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_listings: {
        Row: {
          created_at: string
          duration_type: string
          featured_from: string
          featured_until: string
          id: string
          listing_id: string
          paddle_transaction_id: string | null
          payment_id: string | null
          price: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_type: string
          featured_from: string
          featured_until: string
          id?: string
          listing_id: string
          paddle_transaction_id?: string | null
          payment_id?: string | null
          price: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_type?: string
          featured_from?: string
          featured_until?: string
          id?: string
          listing_id?: string
          paddle_transaction_id?: string | null
          payment_id?: string | null
          price?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_analytics: {
        Row: {
          clicks: number | null
          created_at: string | null
          id: string
          impressions: number | null
          listing_id: string
          messages_sent: number | null
          phone_views: number | null
          updated_at: string | null
        }
        Insert: {
          clicks?: number | null
          created_at?: string | null
          id?: string
          impressions?: number | null
          listing_id: string
          messages_sent?: number | null
          phone_views?: number | null
          updated_at?: string | null
        }
        Update: {
          clicks?: number | null
          created_at?: string | null
          id?: string
          impressions?: number | null
          listing_id?: string
          messages_sent?: number | null
          phone_views?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_analytics_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_favorites: {
        Row: {
          count: number | null
          created_at: string | null
          id: string
          listing_id: string
          user_id: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          id?: string
          listing_id: string
          user_id?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          id?: string
          listing_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_field_values: {
        Row: {
          created_at: string | null
          field_id: string | null
          field_value: Json | null
          id: string
          listing_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          field_id?: string | null
          field_value?: Json | null
          id?: string
          listing_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          field_id?: string | null
          field_value?: Json | null
          id?: string
          listing_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_field_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "category_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_field_values_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_inquiries: {
        Row: {
          count: number | null
          created_at: string | null
          id: string
          listing_id: string
          user_id: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          id?: string
          listing_id: string
          user_id?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          id?: string
          listing_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_views: {
        Row: {
          count: number | null
          created_at: string | null
          id: string
          listing_id: string
          viewer_id: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          id?: string
          listing_id: string
          viewer_id?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          id?: string
          listing_id?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          category_id: string
          certification: string | null
          condition: Database["public"]["Enums"]["listing_condition"] | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          delivery_available: string | null
          description: string | null
          featured: boolean | null
          harvest_date: string | null
          id: string
          images: string[] | null
          location_address: string | null
          location_city: string | null
          location_province: string | null
          min_order_quantity: number | null
          negotiable: Database["public"]["Enums"]["negotiable_status"] | null
          organic: string | null
          payment_terms: string | null
          price: number | null
          price_unit: string | null
          quantity: number | null
          quantity_unit: string | null
          status: Database["public"]["Enums"]["listing_status"] | null
          subcategory_id: string | null
          title: string
          updated_at: string | null
          urgent: boolean | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          category_id: string
          certification?: string | null
          condition?: Database["public"]["Enums"]["listing_condition"] | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          delivery_available?: string | null
          description?: string | null
          featured?: boolean | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location_address?: string | null
          location_city?: string | null
          location_province?: string | null
          min_order_quantity?: number | null
          negotiable?: Database["public"]["Enums"]["negotiable_status"] | null
          organic?: string | null
          payment_terms?: string | null
          price?: number | null
          price_unit?: string | null
          quantity?: number | null
          quantity_unit?: string | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          subcategory_id?: string | null
          title: string
          updated_at?: string | null
          urgent?: boolean | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          category_id?: string
          certification?: string | null
          condition?: Database["public"]["Enums"]["listing_condition"] | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          delivery_available?: string | null
          description?: string | null
          featured?: boolean | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location_address?: string | null
          location_city?: string | null
          location_province?: string | null
          min_order_quantity?: number | null
          negotiable?: Database["public"]["Enums"]["negotiable_status"] | null
          organic?: string | null
          payment_terms?: string | null
          price?: number | null
          price_unit?: string | null
          quantity?: number | null
          quantity_unit?: string | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          subcategory_id?: string | null
          title?: string
          updated_at?: string | null
          urgent?: boolean | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          featured_listing_id: string | null
          id: string
          listing_id: string | null
          metadata: Json | null
          paddle_checkout_id: string | null
          paddle_transaction_id: string | null
          payment_method: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          featured_listing_id?: string | null
          id?: string
          listing_id?: string | null
          metadata?: Json | null
          paddle_checkout_id?: string | null
          paddle_transaction_id?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          featured_listing_id?: string | null
          id?: string
          listing_id?: string | null
          metadata?: Json | null
          paddle_checkout_id?: string | null
          paddle_transaction_id?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_featured_listing_id_fkey"
            columns: ["featured_listing_id"]
            isOneToOne: false
            referencedRelation: "active_featured_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_featured_listing_id_fkey"
            columns: ["featured_listing_id"]
            isOneToOne: false
            referencedRelation: "featured_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          province: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          province?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          province?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_logs: {
        Row: {
          category_id: string | null
          created_at: string | null
          filters: Json | null
          id: string
          query: string
          results_count: number | null
          subcategory_id: string | null
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          filters?: Json | null
          id?: string
          query: string
          results_count?: number | null
          subcategory_id?: string | null
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          filters?: Json | null
          id?: string
          query?: string
          results_count?: number | null
          subcategory_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_logs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_logs_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_suggestions: {
        Row: {
          category_id: string | null
          count: number | null
          created_at: string | null
          id: string
          query: string
          subcategory_id: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          count?: number | null
          created_at?: string | null
          id?: string
          query: string
          subcategory_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          count?: number | null
          created_at?: string | null
          id?: string
          query?: string
          subcategory_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_suggestions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_suggestions_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_featured_listings: {
        Row: {
          category_id: string | null
          created_at: string | null
          duration_type: string | null
          featured_from: string | null
          featured_price: number | null
          featured_until: string | null
          id: string | null
          images: string[] | null
          listing_id: string | null
          listing_price: number | null
          location_city: string | null
          location_province: string | null
          paddle_transaction_id: string | null
          payment_id: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          email: string | null
          id: string | null
          raw_user_meta_data: Json | null
        }
        Insert: {
          email?: string | null
          id?: string | null
          raw_user_meta_data?: Json | null
        }
        Update: {
          email?: string | null
          id?: string | null
          raw_user_meta_data?: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      expire_featured_listings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_search_suggestions: {
        Args: { limit_val?: number; search_query: string }
        Returns: {
          category_id: string
          count: number
          subcategory_id: string
          suggestion: string
        }[]
      }
      get_users_data: {
        Args: { user_ids: string[] }
        Returns: {
          email: string
          id: string
          raw_user_meta_data: Json
        }[]
      }
      increment_listing_analytics: {
        Args: { p_listing_id: string; p_metric: string }
        Returns: undefined
      }
      increment_listing_click: {
        Args: { listing_uuid: string }
        Returns: undefined
      }
      increment_listing_impression: {
        Args: { listing_uuid: string }
        Returns: undefined
      }
      increment_listing_message: {
        Args: { listing_uuid: string }
        Returns: undefined
      }
      increment_listing_phone_view: {
        Args: { listing_uuid: string }
        Returns: undefined
      }
      increment_listing_views: {
        Args: { listing_uuid: string }
        Returns: undefined
      }
      search_listings: {
        Args: {
          category?: string
          city?: string
          item_condition?: string
          limit_val?: number
          max_price?: number
          min_price?: number
          offset_val?: number
          province?: string
          search_query?: string
          sort_by?: string
          sort_order?: string
          subcategory?: string
        }
        Returns: {
          listing_category_id: string
          listing_city: string
          listing_condition: string
          listing_created_at: string
          listing_description: string
          listing_featured: boolean
          listing_id: string
          listing_images: string[]
          listing_price: number
          listing_province: string
          listing_status: string
          listing_subcategory_id: string
          listing_title: string
          listing_urgent: boolean
          listing_user_id: string
          listing_views_count: number
          total_count: number
        }[]
      }
      upsert_search_suggestion: {
        Args: { category?: string; search_query: string; subcategory?: string }
        Returns: undefined
      }
    }
    Enums: {
      listing_condition: "new" | "excellent" | "good" | "fair" | "poor"
      listing_status: "active" | "sold" | "expired" | "draft"
      negotiable_status: "yes" | "no"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      listing_condition: ["new", "excellent", "good", "fair", "poor"],
      listing_status: ["active", "sold", "expired", "draft"],
      negotiable_status: ["yes", "no"],
    },
  },
} as const
