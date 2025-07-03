export { type Database, type Json } from './generated-types';

export type ServiceType = 
  | 'tractor_rental'
  | 'spraying'
  | 'labor'
  | 'land_preparation'
  | 'water_boring'
  | 'harvesting'
  | 'transportation'
  | 'consultancy'
  | 'other';

export type PriceUnit = 'per_hour' | 'per_acre' | 'per_day' | 'fixed';

export interface Tables {
  services: {
    Row: {
      id: string;
      created_at: string;
      updated_at: string;
      title: string;
      description: string;
      service_type: ServiceType;
      price: number;
      price_unit: PriceUnit;
      negotiable: boolean;
      location_city: string;
      location_province: string;
      location_address: string | null;
      contact_name: string;
      contact_phone: string;
      contact_email: string | null;
      images: string[] | null;
      status: string;
      user_id: string;
      featured: boolean;
      views_count: number;
    };
    Insert: Omit<Tables['services']['Row'], 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<Tables['services']['Row'], 'id' | 'created_at' | 'updated_at'>>;
  };
  // ... existing tables ...
}
