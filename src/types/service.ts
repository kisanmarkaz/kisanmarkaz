export const ServiceTypeEnum = {
  tractor_rental: 'tractor_rental',
  spraying: 'spraying',
  labor: 'labor',
  land_preparation: 'land_preparation',
  water_boring: 'water_boring',
  harvesting: 'harvesting',
  transportation: 'transportation',
  consultancy: 'consultancy',
  other: 'other'
} as const;

export type ServiceType = keyof typeof ServiceTypeEnum;

export interface Service {
  id: string;
  title: string;
  description: string;
  service_type: ServiceType;
  price: number;
  price_unit: 'per_hour' | 'per_acre' | 'per_day' | 'fixed';
  negotiable: boolean;
  location_city: string;
  location_province: string;
  location_address?: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  images?: string[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  user_id: string;
  featured: boolean;
  views_count: number;
} 