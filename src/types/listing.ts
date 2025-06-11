import { Category } from './category';
import { Subcategory } from './subcategory';
import { Profile } from './profile';

export interface CategoryField {
  id: string;
  category_id: string;
  field_name: string;
  field_label: string;
  field_type: 'text' | 'number' | 'boolean' | 'date';
  required: boolean;
  created_at: string;
}

export interface ListingFieldValue {
  id: string;
  listing_id: string;
  field_id: string;
  field_value: string;
  created_at: string;
  field: CategoryField;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  price_unit: 'total' | 'per_kg' | 'per_acre' | 'per_unit';
  category_id: string;
  subcategory_id?: string;
  user_id: string;
  status: 'active' | 'sold' | 'expired';
  created_at: string;
  updated_at: string;
  images?: string[];
  quantity?: number;
  quantity_unit?: string;
  condition?: string;
  negotiable?: boolean;
  harvest_date?: string;
  organic?: boolean;
  certification?: string;
  delivery_available?: boolean;
  min_order_quantity?: number;
  payment_terms?: string;
  location_address?: string;
  location_city: string;
  location_province: string;
  location_coordinates?: { lat: number; lng: number };
  category?: Category;
  subcategory?: Subcategory;
  user?: Profile;
  field_values?: ListingFieldValue[];
  contact_phone?: string;
} 