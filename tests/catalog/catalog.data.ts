export const expectedProducts = [
  { name: 'Sauce Labs Backpack', price: '$29.99' },
  { name: 'Sauce Labs Bike Light', price: '$9.99' },
  { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' },
  { name: 'Sauce Labs Fleece Jacket', price: '$49.99' },
  { name: 'Sauce Labs Onesie', price: '$7.99' },
  { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' },
] as const;

export const namesAscending = expectedProducts.map((p) => p.name);

export const namesPriceAscending = [
  'Sauce Labs Onesie',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Test.allTheThings() T-Shirt (Red)',
  'Sauce Labs Backpack',
  'Sauce Labs Fleece Jacket',
];

export const namesPriceDescending = [
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Backpack',
  'Sauce Labs Bolt T-Shirt',
  'Test.allTheThings() T-Shirt (Red)',
  'Sauce Labs Bike Light',
  'Sauce Labs Onesie',
];
