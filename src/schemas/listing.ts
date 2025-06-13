import { z } from 'zod';

export const YesNoEnum = {
  yes: 'yes',
  no: 'no'
} as const;

export const ConditionEnum = {
  new: 'new',
  excellent: 'excellent',
  good: 'good',
  fair: 'fair',
  poor: 'poor'
} as const;

export const CertificationEnum = {
  none: '',
  organic: 'organic',
  gap: 'gap',
  other: 'other'
} as const;

export const PaymentTermsEnum = {
  none: '',
  advance: 'advance',
  partial: 'partial',
  delivery: 'delivery',
  credit: 'credit'
} as const;

export const ListingStatusEnum = {
  active: 'active',
  sold: 'sold',
  expired: 'expired',
  draft: 'draft'
} as const;

export const PriceUnitEnum = {
  total: 'total',
  per_kg: 'per_kg',
  per_piece: 'per_piece'
} as const;

export const QuantityUnitEnum = {
  kg: 'kg',
  piece: 'piece',
  ton: 'ton',
  quintal: 'quintal'
} as const;

export const listingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  price_unit: z.nativeEnum(PriceUnitEnum).default(PriceUnitEnum.total),
  category_id: z.string().min(1, 'Category is required'),
  location_city: z.string().min(1, 'City is required'),
  location_province: z.string().optional(),
  location_address: z.string().optional(),
  quantity: z.string().min(1, 'Quantity is required'),
  quantity_unit: z.nativeEnum(QuantityUnitEnum).default(QuantityUnitEnum.kg),
  harvest_date: z.string().optional(),
  organic: z.nativeEnum(YesNoEnum).default(YesNoEnum.no),
  certification: z.nativeEnum(CertificationEnum).default(CertificationEnum.none),
  negotiable: z.nativeEnum(YesNoEnum).default(YesNoEnum.no),
  condition: z.nativeEnum(ConditionEnum).default(ConditionEnum.new),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  delivery_available: z.nativeEnum(YesNoEnum).default(YesNoEnum.no),
  min_order_quantity: z.string().optional(),
  payment_terms: z.nativeEnum(PaymentTermsEnum).default(PaymentTermsEnum.none),
  status: z.nativeEnum(ListingStatusEnum).default(ListingStatusEnum.active)
});

export type ListingFormData = z.infer<typeof listingSchema>; 