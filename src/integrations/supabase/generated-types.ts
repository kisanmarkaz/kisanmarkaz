import { 
  type PriceUnit,
  type QuantityUnit,
  type YesNo,
  type Condition,
  type Certification,
  type PaymentTerms,
  type ListingStatus
} from '../../schemas/listing';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

interface ListingRow {
  id: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  title: string;
  description: string;
  price: number;
  category_id: string;
  subcategory_id: string | null;
  location_city: string;
  location_province: string | null;
  location_address: string | null;
  quantity: number;
  quantity_unit: QuantityUnit;
  price_unit: PriceUnit;
  harvest_date: string | null;
  organic: YesNo;
  certification: Certification;
  negotiable: YesNo;
  condition: Condition;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  delivery_available: YesNo;
  min_order_quantity: number | null;
  payment_terms: PaymentTerms;
  status: ListingStatus;
  images: string[] | null;
}

interface CategoryRow {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  icon: string | null;
}

interface SubcategoryRow {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  category_id: string;
}

interface ProfileRow {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: ListingRow;
        Insert: Omit<ListingRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ListingRow, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: 'listings_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'listings_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'listings_subcategory_id_fkey';
            columns: ['subcategory_id'];
            referencedRelation: 'subcategories';
            referencedColumns: ['id'];
          }
        ];
      };
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CategoryRow, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      subcategories: {
        Row: SubcategoryRow;
        Insert: Omit<SubcategoryRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SubcategoryRow, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: 'subcategories_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 