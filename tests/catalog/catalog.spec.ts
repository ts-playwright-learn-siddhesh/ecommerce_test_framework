import { test, expect } from '@/fixtures/test-base.ts';
import { expectedProducts, namesAscending } from './catalog.data.ts';

test.describe(
  'Catalog — Inventory',
  {
    tag: ['@catalog'],
  },
  () => {
    // ============================================================
    // TC-CATALOG-001: Loading the inventory page after login shows
    // the "Products" title and all six product cards
    // ============================================================
    test(
      '[TC-CATALOG-001] inventory page loads with title and 6 products after login',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-001' }],
        tag: ['@smoke', '@positive'],
      },
      async ({ loggedInPage }) => {
        await expect(loggedInPage.inventoryContainer).toBeVisible();
        await expect(loggedInPage.title).toBeVisible();
        await expect(loggedInPage.title).toHaveText('Products');
        await expect(loggedInPage.inventoryItems).toHaveCount(expectedProducts.length);
      }
    );

    // ============================================================
    // TC-CATALOG-002: Every product card shows an image, name,
    // description, price, and Add to cart button, and the full set
    // of names/prices matches the expected catalog in default order
    // ============================================================
    test(
      '[TC-CATALOG-002] each product card shows image, name, description, price, and Add to cart button',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-002' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const inventoryItems = loggedInPage.inventoryItems;
        await expect(inventoryItems).toHaveCount(expectedProducts.length);

        for (let i = 0; i < expectedProducts.length; i++) {
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
      }
    );

    // ============================================================
    // TC-CATALOG-003: Every product image fully loads (no broken
    // placeholder) with the correct alt text matching the product name
    // ============================================================
    test(
      '[TC-CATALOG-003] every product image loads fully with no broken placeholder and correct alt text',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-003' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const inventoryItems = loggedInPage.inventoryItems;
        await expect(inventoryItems).toHaveCount(expectedProducts.length);

        for (let i = 0; i < expectedProducts.length; i++) {
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
      }
    );
  }
);
