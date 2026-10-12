import { faker } from '@faker-js/faker';
import type { CheckoutInfo } from '@/pages/CheckoutInfoPage.ts';

export const TAX_RATE = 0.08;

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
