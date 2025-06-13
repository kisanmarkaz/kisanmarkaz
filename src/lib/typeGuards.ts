import { YesNoEnum, CertificationEnum, ConditionEnum, PaymentTermsEnum, ListingStatusEnum, PriceUnitEnum, QuantityUnitEnum } from '../schemas/listing';

export type YesNo = typeof YesNoEnum[keyof typeof YesNoEnum];
export type Certification = typeof CertificationEnum[keyof typeof CertificationEnum];
export type Condition = typeof ConditionEnum[keyof typeof ConditionEnum];
export type PaymentTerms = typeof PaymentTermsEnum[keyof typeof PaymentTermsEnum];
export type ListingStatus = typeof ListingStatusEnum[keyof typeof ListingStatusEnum];
export type PriceUnit = typeof PriceUnitEnum[keyof typeof PriceUnitEnum];
export type QuantityUnit = typeof QuantityUnitEnum[keyof typeof QuantityUnitEnum];

export const isYesNo = (value: unknown): value is YesNo => {
  return typeof value === 'string' && Object.values(YesNoEnum).includes(value as YesNo);
};

export const isCertification = (value: unknown): value is Certification => {
  return typeof value === 'string' && Object.values(CertificationEnum).includes(value as Certification);
};

export const isCondition = (value: unknown): value is Condition => {
  return typeof value === 'string' && Object.values(ConditionEnum).includes(value as Condition);
};

export const isPaymentTerms = (value: unknown): value is PaymentTerms => {
  return typeof value === 'string' && Object.values(PaymentTermsEnum).includes(value as PaymentTerms);
};

export const isListingStatus = (value: unknown): value is ListingStatus => {
  return typeof value === 'string' && Object.values(ListingStatusEnum).includes(value as ListingStatus);
};

export const isPriceUnit = (value: unknown): value is PriceUnit => {
  return typeof value === 'string' && Object.values(PriceUnitEnum).includes(value as PriceUnit);
};

export const isQuantityUnit = (value: unknown): value is QuantityUnit => {
  return typeof value === 'string' && Object.values(QuantityUnitEnum).includes(value as QuantityUnit);
}; 