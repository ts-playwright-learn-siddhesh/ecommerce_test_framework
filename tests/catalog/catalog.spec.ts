import { test, expect } from '@/fixtures/test-base.ts';
import {
  expectedProducts,
  namesAscending,
  namesDescending,
  namesPriceAscending,
  namesPriceDescending,
} from './catalog.data.ts';
import { CATALOG_PRODUCTS } from './catalog.constants.ts';
import { getExpectedProduct } from './catalog-utils.ts';

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
        tag: ['@positive'],
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
          await expect(loggedInPage.itemImage(item)).toBeVisible();
          await expect(loggedInPage.itemName(item)).toBeVisible();
          await expect(loggedInPage.itemDescription(item)).toBeVisible();
          await expect(loggedInPage.itemPrice(item)).toHaveText(/^\$\d+\.\d{2}$/);
          await expect(loggedInPage.itemAddToCartButton(item)).toBeVisible();
        }

        await expect(loggedInPage.itemNames).toHaveText(namesAscending);
        await expect(loggedInPage.itemPrices).toHaveText(expectedProducts.map((p) => p.price));
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
          const image = loggedInPage.itemImage(inventoryItems.nth(i));

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

    // ============================================================
    // TC-CATALOG-004: Clicking a product name opens its detail page
    // with matching name, description, and price
    // ============================================================
    test(
      '[TC-CATALOG-004] clicking a product name opens its detail page with matching name, description, and price',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-004' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const inventoryItems = loggedInPage.inventoryItems;
        await expect(inventoryItems).toHaveCount(expectedProducts.length);

        const expectedBackpack = getExpectedProduct(CATALOG_PRODUCTS.BACKPACK);
        const backpackItem = inventoryItems.filter({ hasText: CATALOG_PRODUCTS.BACKPACK });
        const recordedDescription = await loggedInPage.itemDescription(backpackItem).innerText();

        const detailPage = await loggedInPage.openProductDetail(backpackItem);

        await expect(detailPage.image).toBeVisible();
        await expect(detailPage.name).toHaveText(expectedBackpack.name);
        await expect(detailPage.description).toHaveText(recordedDescription);
        await expect(detailPage.price).toHaveText(expectedBackpack.price);
        await expect(detailPage.addToCartButton).toBeVisible();
        await expect(detailPage.backToProductsButton).toBeVisible();
      }
    );

    // ============================================================
    // TC-CATALOG-005: "Back to products" returns from the detail
    // page to the full inventory grid
    // ============================================================
    test(
      '[TC-CATALOG-005] Back to products returns from detail page to the full inventory grid',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-005' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const inventoryItems = loggedInPage.inventoryItems;
        await expect(inventoryItems).toHaveCount(expectedProducts.length);

        const bikeLightItem = inventoryItems.filter({ hasText: CATALOG_PRODUCTS.BIKE_LIGHT });
        const detailPage = await loggedInPage.openProductDetail(bikeLightItem);
        await expect(detailPage.name).toHaveText(CATALOG_PRODUCTS.BIKE_LIGHT);

        const inventoryPage = await detailPage.backToProducts();

        await expect(inventoryPage.inventoryContainer).toBeVisible();
        await expect(inventoryPage.inventoryItems).toHaveCount(expectedProducts.length);
      }
    );

    // ============================================================
    // TC-CATALOG-006: Sort order resets to Name (A to Z) after
    // returning from a product detail page
    // ============================================================
    test(
      '[TC-CATALOG-006] sort order resets to Name (A to Z) after returning from a product detail page',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-006' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const inventoryItems = loggedInPage.inventoryItems;
        await expect(inventoryItems).toHaveCount(expectedProducts.length);
        await expect(loggedInPage.sortDropdown).toHaveValue('az');

        await loggedInPage.sortBy('hilo');
        await expect(loggedInPage.itemNames).toHaveText(namesPriceDescending);
        await expect(loggedInPage.sortDropdown).toHaveValue('hilo');

        const detailPage = await loggedInPage.openProductDetail(inventoryItems.first());
        await expect(detailPage.name).toHaveText(CATALOG_PRODUCTS.FLEECE_JACKET);

        const inventoryPage = await detailPage.backToProducts();

        await expect(inventoryPage.sortDropdown).toHaveValue('az');
        await expect(inventoryPage.itemNames).toHaveText(namesAscending);
      }
    );

    // ============================================================
    // TC-CATALOG-007: Inventory card and detail page show matching
    // name, price, description, and image alt text
    // ============================================================
    test(
      '[TC-CATALOG-007] inventory card and detail page show matching name, price, description, and image alt',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-007' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const inventoryItems = loggedInPage.inventoryItems;
        await expect(inventoryItems).toHaveCount(expectedProducts.length);

        const expectedOnesie = getExpectedProduct(CATALOG_PRODUCTS.ONESIE);
        const onesieItem = inventoryItems.filter({ hasText: CATALOG_PRODUCTS.ONESIE });
        const recordedDescription = await loggedInPage.itemDescription(onesieItem).innerText();
        const recordedAlt = await loggedInPage.itemImage(onesieItem).evaluate((image) => (image as { alt: string }).alt);
        const recordedSrc = await loggedInPage.itemImage(onesieItem).getAttribute('src');
        expect(recordedAlt).toBeTruthy();

        const detailPage = await loggedInPage.openProductDetail(onesieItem);

        await expect(detailPage.name).toHaveText(expectedOnesie.name);
        await expect(detailPage.price).toHaveText(expectedOnesie.price);
        await expect(detailPage.description).toHaveText(recordedDescription);
        await expect(detailPage.image).toHaveAttribute('alt', recordedAlt);
        expect(recordedSrc).toBeTruthy();
      }
    );

    // ============================================================
    // TC-CATALOG-008: Selecting Name (A to Z) sorts products
    // alphabetically ascending
    // ============================================================
    test(
      '[TC-CATALOG-008] selecting Name (A to Z) sorts products alphabetically ascending',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-008' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const inventoryItems = loggedInPage.inventoryItems;
        await expect(inventoryItems).toHaveCount(expectedProducts.length);

        await loggedInPage.sortBy('lohi');
        await expect(loggedInPage.itemNames).toHaveText(namesPriceAscending);

        await loggedInPage.sortBy('az');
        await expect(loggedInPage.itemNames).toHaveText(namesAscending);
      }
    );

    // ============================================================
    // TC-CATALOG-009: Selecting Price (low to high) sorts products
    // by ascending price
    // ============================================================
    test(
      '[TC-CATALOG-009] selecting Price (low to high) sorts products by ascending price',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-009' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const inventoryItems = loggedInPage.inventoryItems;
        await expect(inventoryItems).toHaveCount(expectedProducts.length);
        await expect(loggedInPage.sortDropdown).toHaveValue('az');

        await loggedInPage.sortBy('lohi');

        await expect(loggedInPage.itemNames).toHaveText(namesPriceAscending);
      }
    );

    // ============================================================
    // TC-CATALOG-010: Selecting Name (Z to A) sorts products
    // alphabetically descending
    // ============================================================
    test(
      '[TC-CATALOG-010] selecting Name (Z to A) sorts products alphabetically descending',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-010' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const inventoryItems = loggedInPage.inventoryItems;
        await expect(inventoryItems).toHaveCount(expectedProducts.length);
        await expect(loggedInPage.sortDropdown).toHaveValue('az');

        await loggedInPage.sortBy('za');

        await expect(loggedInPage.itemNames).toHaveText(namesDescending);
      }
    );

    // ============================================================
    // TC-CATALOG-011: Sort dropdown's selected option updates for
    // each sort choice
    // ============================================================
    test(
      '[TC-CATALOG-011] sort dropdown option selected attribute updates for each sort choice',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-011' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const sortDropdown = loggedInPage.sortDropdown;
        await expect(sortDropdown).toHaveValue('az');
        await expect(sortDropdown.locator('option[value="az"]')).toHaveJSProperty('selected', true);

        await loggedInPage.sortBy('za');
        await expect(sortDropdown).toHaveValue('za');
        await expect(sortDropdown.locator('option[value="za"]')).toHaveJSProperty('selected', true);

        await loggedInPage.sortBy('lohi');
        await expect(sortDropdown).toHaveValue('lohi');
        await expect(sortDropdown.locator('option[value="lohi"]')).toHaveJSProperty('selected', true);

        await loggedInPage.sortBy('hilo');
        await expect(sortDropdown).toHaveValue('hilo');
        await expect(sortDropdown.locator('option[value="hilo"]')).toHaveJSProperty('selected', true);
      }
    );

    // ============================================================
    // TC-CATALOG-012: Hamburger menu opens showing All Items, About,
    // Logout, Reset App State links
    // ============================================================
    test(
      '[TC-CATALOG-012] hamburger menu opens showing All Items, About, Logout, Reset App State links',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-012' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const inventoryItems = loggedInPage.inventoryItems;
        await expect(inventoryItems).toHaveCount(expectedProducts.length);
        await expect(loggedInPage.sidebarMenu.menuWrap).toBeHidden();

        await loggedInPage.sidebarMenu.open();

        await expect(loggedInPage.sidebarMenu.menuWrap).toBeVisible();
        await expect(loggedInPage.sidebarMenu.menuLinks).toHaveText(['All Items', 'About', 'Logout', 'Reset App State']);
        await expect(loggedInPage.sidebarMenu.closeButton).toBeVisible();
      }
    );

    // ============================================================
    // TC-CATALOG-013: Hamburger menu closes when the X button is
    // clicked
    // ============================================================
    test(
      '[TC-CATALOG-013] hamburger menu closes when the X button is clicked',
      {
        annotation: [{ type: 'test-case', description: 'TC-CATALOG-013' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const inventoryItems = loggedInPage.inventoryItems;
        await expect(inventoryItems).toHaveCount(expectedProducts.length);

        await loggedInPage.sidebarMenu.open();
        await expect(loggedInPage.sidebarMenu.menuWrap).toBeVisible();
        await expect(loggedInPage.sidebarMenu.menuLinks).toHaveText(['All Items', 'About', 'Logout', 'Reset App State']);

        await loggedInPage.sidebarMenu.close();

        await expect(loggedInPage.sidebarMenu.menuWrap).toBeHidden();
        await expect(inventoryItems).toHaveCount(expectedProducts.length);
      }
    );
  }
);
