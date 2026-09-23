import { CATALOG_PRODUCTS } from './catalog.constants.ts';
import type { SortOption } from '@/pages/InventoryPage.ts';

export const expectedProducts = [
  { name: CATALOG_PRODUCTS.BACKPACK, price: '$29.99' },
  { name: CATALOG_PRODUCTS.BIKE_LIGHT, price: '$9.99' },
  { name: CATALOG_PRODUCTS.BOLT_T_SHIRT, price: '$15.99' },
  { name: CATALOG_PRODUCTS.FLEECE_JACKET, price: '$49.99' },
  { name: CATALOG_PRODUCTS.ONESIE, price: '$7.99' },
  { name: CATALOG_PRODUCTS.ALL_THE_THINGS_T_SHIRT, price: '$15.99' },
] as const;

export const namesAscending = expectedProducts.map((p) => p.name);

export const namesDescending = [...namesAscending].reverse();

export const namesPriceAscending = [
  CATALOG_PRODUCTS.ONESIE,
  CATALOG_PRODUCTS.BIKE_LIGHT,
  CATALOG_PRODUCTS.BOLT_T_SHIRT,
  CATALOG_PRODUCTS.ALL_THE_THINGS_T_SHIRT,
  CATALOG_PRODUCTS.BACKPACK,
  CATALOG_PRODUCTS.FLEECE_JACKET,
];

export const namesPriceDescending = [
  CATALOG_PRODUCTS.FLEECE_JACKET,
  CATALOG_PRODUCTS.BACKPACK,
  CATALOG_PRODUCTS.BOLT_T_SHIRT,
  CATALOG_PRODUCTS.ALL_THE_THINGS_T_SHIRT,
  CATALOG_PRODUCTS.BIKE_LIGHT,
  CATALOG_PRODUCTS.ONESIE,
];

export const SORT_OPTIONS = {
  NAME_ASC: 'az',
  NAME_DESC: 'za',
  PRICE_ASC: 'lohi',
  PRICE_DESC: 'hilo',
} as const satisfies Record<string, SortOption>;

export const EXPECTED_MENU_LINKS = [
  'All Items',
  'Dynamic Catalog',
  'About',
  'Logout',
  'Reset App State',
] as const;
