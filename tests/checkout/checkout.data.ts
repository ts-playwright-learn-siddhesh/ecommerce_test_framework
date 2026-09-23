import { faker } from '@faker-js/faker';
import type { CheckoutInfo } from '@/pages/CheckoutInfoPage.ts';

export const TAX_RATE = 0.08;

// Fixed values reused across the required-field negative tests (TC-CHECKOUT-003/004/005),
// so each test fills the same two non-empty fields and only the field under test is left blank.
export const PARTIAL_CHECKOUT_INFO = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
} as const;

export function validCheckoutInfo(): CheckoutInfo {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
  };
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}
