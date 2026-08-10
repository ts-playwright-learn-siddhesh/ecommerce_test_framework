import { test, expect } from '@playwright/test';

const expectedProducts = [
  { name: 'Sauce Labs Backpack', price: '$29.99' },
  { name: 'Sauce Labs Bike Light', price: '$9.99' },
  { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' },
  { name: 'Sauce Labs Fleece Jacket', price: '$49.99' },
  { name: 'Sauce Labs Onesie', price: '$7.99' },
  { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' },
];
const namesAscending = expectedProducts.map((p) => p.name);
const namesDescending = [...namesAscending].reverse();
const namesPriceAscending = [
  'Sauce Labs Onesie',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Test.allTheThings() T-Shirt (Red)',
  'Sauce Labs Backpack',
  'Sauce Labs Fleece Jacket',
];
const namesPriceDescending = [
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Backpack',
  'Sauce Labs Bolt T-Shirt',
  'Test.allTheThings() T-Shirt (Red)',
  'Sauce Labs Bike Light',
  'Sauce Labs Onesie',
];

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory\.html/);
});

test('test-1: inventory page loads with title and 6 products after login', async ({ page }) => {
  await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
  await expect(page.locator('[data-test="title"]')).toBeVisible();
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');

  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);
});



test('test-2: each product card shows image, name, description, price, and Add to cart button', async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);

  for (let i = 0; i < 6; i++) {
    const item = inventoryItems.nth(i);
    await expect(item.locator('img')).toBeVisible();
    await expect(item.locator('[data-test="inventory-item-name"]')).toBeVisible();
    await expect(item.locator('[data-test="inventory-item-desc"]')).toBeVisible();
    await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(/^\$\d+\.\d{2}$/);
    await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  }

  await expect(inventoryItems.locator('[data-test="inventory-item-name"]')).toHaveText(namesAscending);
  await expect(inventoryItems.locator('[data-test="inventory-item-price"]')).toHaveText(
    expectedProducts.map((p) => p.price)
  );
});



test('test-3: every product image loads fully with no broken placeholder and correct alt text', async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);

  for (let i = 0; i < 6; i++) {
    const image = inventoryItems.nth(i).locator('img');

    await expect(image).toHaveJSProperty('complete', true);
    const naturalWidth = await image.evaluate((img) => (img as { naturalWidth: number }).naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);

    const expectedProduct = expectedProducts[i];
    if (!expectedProduct) {
      throw new Error(`Missing expected product at index ${i}`);
    }
    await expect(image).toHaveAttribute('alt', expectedProduct.name);
  }
});


test('test-4: clicking a product name opens its detail page with matching name, description, and price', async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);

  const backpackItem = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Backpack' });
  const recordedName = await backpackItem.locator('[data-test="inventory-item-name"]').textContent();
  const recordedDescription = await backpackItem.locator('[data-test="inventory-item-desc"]').textContent();
  const recordedPrice = await backpackItem.locator('[data-test="inventory-item-price"]').textContent();

  await backpackItem.locator('[data-test="inventory-item-name"]').click();
  await expect(page).toHaveURL(/inventory-item\.html\?id=/);

  await expect(page.locator('img.inventory_details_img')).toBeVisible();
  await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(recordedName ?? '');
  await expect(page.locator('[data-test="inventory-item-desc"]')).toHaveText(recordedDescription ?? '');
  await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(recordedPrice ?? '');
  await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
});



test('test-5: Back to products returns from detail page to the full inventory grid', async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);

  const bikeLightItem = inventoryItems.filter({ hasText: 'Sauce Labs Bike Light' });
  await bikeLightItem.locator('[data-test="inventory-item-name"]').click();
  await expect(page).toHaveURL(/inventory-item\.html\?id=/);
  await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bike Light');

  await page.locator('[data-test="back-to-products"]').click();
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryItems).toHaveCount(6);
});



test('test-6: sort order resets to Name (A to Z) after returning from a product detail page', async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);
  await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');

  await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
  await expect(inventoryItems.locator('[data-test="inventory-item-name"]')).toHaveText(namesPriceDescending);
  await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('hilo');

  await inventoryItems.first().locator('[data-test="inventory-item-name"]').click();
  await expect(page).toHaveURL(/inventory-item\.html\?id=/);
  await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Fleece Jacket');

  await page.locator('[data-test="back-to-products"]').click();
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');
  await expect(inventoryItems.locator('[data-test="inventory-item-name"]')).toHaveText(namesAscending);
});



test('test-7: inventory card and detail page show matching name, price, description, and image alt', async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);

  const onesieItem = inventoryItems.filter({ hasText: 'Sauce Labs Onesie' });
  const recordedName = await onesieItem.locator('[data-test="inventory-item-name"]').textContent();
  const recordedPrice = await onesieItem.locator('[data-test="inventory-item-price"]').textContent();
  const recordedDescription = await onesieItem.locator('[data-test="inventory-item-desc"]').textContent();
  const recordedAlt = await onesieItem.locator('img').getAttribute('alt');
  const recordedSrc = await onesieItem.locator('img').getAttribute('src');

  await onesieItem.locator('[data-test="inventory-item-name"]').click();
  await expect(page).toHaveURL(/inventory-item\.html\?id=/);

  await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(recordedName ?? '');
  await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(recordedPrice ?? '');
  await expect(page.locator('[data-test="inventory-item-desc"]')).toHaveText(recordedDescription ?? '');
  await expect(page.locator('img.inventory_details_img')).toHaveAttribute('alt', recordedAlt ?? '');
  expect(recordedSrc).toBeTruthy();
});



test('test-8: selecting Name (A to Z) sorts products alphabetically ascending', async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);

  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
  await page.locator('[data-test="product-sort-container"]').selectOption('az');

  await expect(inventoryItems.locator('[data-test="inventory-item-name"]')).toHaveText(namesAscending);
});



test('test-9: selecting Name (Z to A) sorts products alphabetically descending', async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);
  await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');

  await page.locator('[data-test="product-sort-container"]').selectOption('za');

  await expect(inventoryItems.locator('[data-test="inventory-item-name"]')).toHaveText(namesDescending);
});



test('test-10: selecting Price (low to high) sorts products by ascending price', async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);
  await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');

  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

  await expect(inventoryItems.locator('[data-test="inventory-item-name"]')).toHaveText(namesPriceAscending);
});



test('test-11: sort dropdown option selected attribute updates for each sort choice', async ({ page }) => {
  const sortDropdown = page.locator('[data-test="product-sort-container"]');
  await expect(sortDropdown).toHaveValue('az');
  await expect(sortDropdown.locator('option[value="az"]')).toHaveJSProperty('selected', true);

  await sortDropdown.selectOption('za');
  await expect(sortDropdown).toHaveValue('za');
  await expect(sortDropdown.locator('option[value="za"]')).toHaveJSProperty('selected', true);

  await sortDropdown.selectOption('lohi');
  await expect(sortDropdown).toHaveValue('lohi');
  await expect(sortDropdown.locator('option[value="lohi"]')).toHaveJSProperty('selected', true);

  await sortDropdown.selectOption('hilo');
  await expect(sortDropdown).toHaveValue('hilo');
  await expect(sortDropdown.locator('option[value="hilo"]')).toHaveJSProperty('selected', true);
});



test('test-12: hamburger menu opens showing All Items, About, Logout, Reset App State links', async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);
  await expect(page.locator('.bm-menu-wrap')).toBeHidden();

  await page.locator('#react-burger-menu-btn').click();
  await expect(page.locator('.bm-menu-wrap')).toBeVisible();

  const menuLinks = page.locator('.bm-item-list a');
  await expect(menuLinks).toHaveText(['All Items', 'About', 'Logout', 'Reset App State']);
  await expect(page.locator('#react-burger-cross-btn')).toBeVisible();
});



test('test-13: hamburger menu closes when the X button is clicked', async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item"]');
  await expect(inventoryItems).toHaveCount(6);

  await page.locator('#react-burger-menu-btn').click();
  await expect(page.locator('.bm-menu-wrap')).toBeVisible();
  await expect(page.locator('.bm-item-list a')).toHaveText(['All Items', 'About', 'Logout', 'Reset App State']);

  await page.locator('#react-burger-cross-btn').click();
  await expect(page.locator('.bm-menu-wrap')).toBeHidden();
  await expect(inventoryItems).toHaveCount(6);
});