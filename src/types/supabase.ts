export interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

export interface Listing {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: number;
  price_unit?: 'total' | 'per_kg' | 'per_acre' | 'per_unit';
  quantity?: number;
  quantity_unit?: 'kg' | 'tons' | 'acres' | 'units';
  harvest_date?: string;
  organic?: 'yes' | 'no';
  certification?: 'organic' | 'gap' | 'other';
  negotiable?: 'yes' | 'no';
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor' | null;
  location_city: string;
  location_province: string;
  location_address?: string;
  status: 'active' | 'sold' | 'expired' | 'draft';
  category_id: string;
  subcategory_id: string | null;
  user_id: string;
  contact_phone: string | null;
  contact_email: string | null;
  contact_name: string | null;
  images: string[] | null;
  urgent: boolean;
  featured: boolean;
  delivery_available?: 'yes' | 'no';
  min_order_quantity?: number;
  payment_terms?: 'advance' | 'partial' | 'delivery' | 'credit';
  category?: Category;
  subcategory?: Subcategory;
  user?: Profile;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      listings: {
        Row: {
          category_id: string
          certification: string | null
          condition: "new" | "excellent" | "good" | "fair" | "poor" | null
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
          negotiable: "yes" | "no" | null
          organic: string | null
          payment_terms: string | null
          price: number | null
          price_unit: string | null
          quantity: number | null
          quantity_unit: string | null
          status: "active" | "sold" | "expired" | "draft" | null
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
          condition?: "new" | "excellent" | "good" | "fair" | "poor" | null
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
          negotiable?: "yes" | "no" | null
          organic?: string | null
          payment_terms?: string | null
          price?: number | null
          price_unit?: string | null
          quantity?: number | null
          quantity_unit?: string | null
          status?: "active" | "sold" | "expired" | "draft" | null
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
          condition?: "new" | "excellent" | "good" | "fair" | "poor" | null
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
          negotiable?: "yes" | "no" | null
          organic?: string | null
          payment_terms?: string | null
          price?: number | null
          price_unit?: string | null
          quantity?: number | null
          quantity_unit?: string | null
          status?: "active" | "sold" | "expired" | "draft" | null
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
          }
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_listing_views: {
        Args: { listing_uuid: string }
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