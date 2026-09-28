import { test, expect } from '@/fixtures/test-base.ts';
import { CATALOG_PRODUCTS } from '../catalog/catalog.constants.ts';
import { getExpectedProduct } from '../catalog/catalog-utils.ts';
import { CheckoutInfoPage } from '@/pages/CheckoutInfoPage.ts';
import { CheckoutOverviewPage } from '@/pages/CheckoutOverviewPage.ts';
import { CheckoutCompletePage } from '@/pages/CheckoutCompletePage.ts';
import { CartPage } from '@/pages/CartPage.ts';
import { InventoryPage } from '@/pages/InventoryPage.ts';
import {
  CHECKOUT_ERRORS,
  CHECKOUT_COMPLETE_HEADER,
  CHECKOUT_COMPLETE_TEXT,
} from './checkout.constants.ts';
import { validCheckoutInfo, formatCurrency, calculateTax, PARTIAL_CHECKOUT_INFO } from './checkout.data.ts';

test.describe(
  'Checkout — Process',
  {
    tag: ['@checkout'],
  },
  () => {
    // ============================================================
    // TC-CHECKOUT-001: Clicking Checkout on the cart page opens the
    // checkout information page with the expected form fields
    // ============================================================
    test(
      '[TC-CHECKOUT-001] checkout button navigates from cart to checkout info page with expected fields',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-001' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BACKPACK);
        const cartPage = await loggedInPage.goToCart();

        const checkoutInfoPage = await cartPage.checkout();

        await expect(loggedInPage.currentPage).toHaveURL(CheckoutInfoPage.url);
        await expect(checkoutInfoPage.firstNameInput).toBeVisible();
        await expect(checkoutInfoPage.lastNameInput).toBeVisible();
        await expect(checkoutInfoPage.postalCodeInput).toBeVisible();
        await expect(checkoutInfoPage.cancelButton).toBeVisible();
        await expect(checkoutInfoPage.continueButton).toBeVisible();
      }
    );

    // ============================================================
    // TC-CHECKOUT-002: Submitting valid checkout information moves
    // the user to the checkout overview page
    // ============================================================
    test(
      '[TC-CHECKOUT-002] completing checkout info with valid data reaches checkout overview page',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-002' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BACKPACK);
        const cartPage = await loggedInPage.goToCart();
        const checkoutInfoPage = await cartPage.checkout();

        const overviewPage = await checkoutInfoPage.continueCheckout(validCheckoutInfo());

        await expect(loggedInPage.currentPage).toHaveURL(CheckoutOverviewPage.url);
        await expect(overviewPage.summaryContainer).toBeVisible();
      }
    );

    // ============================================================
    // TC-CHECKOUT-003: Submitting checkout info with First Name left
    // blank shows the required-field error and retains the other
    // entered values
    // ============================================================
    test(
      '[TC-CHECKOUT-003] checkout info with missing First Name shows required-field error',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-003' }],
        tag: ['@negative'],
      },
      async ({ loggedInPage }) => {
        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BACKPACK);
        const cartPage = await loggedInPage.goToCart();
        const checkoutInfoPage = await cartPage.checkout();

        await checkoutInfoPage.continueExpectingFailure({
          lastName: PARTIAL_CHECKOUT_INFO.lastName,
          postalCode: PARTIAL_CHECKOUT_INFO.postalCode,
        });

        await expect(checkoutInfoPage.errorMessage).toHaveText(CHECKOUT_ERRORS.FIRST_NAME_REQUIRED);
        await expect(checkoutInfoPage.lastNameInput).toHaveValue(PARTIAL_CHECKOUT_INFO.lastName);
        await expect(checkoutInfoPage.postalCodeInput).toHaveValue(PARTIAL_CHECKOUT_INFO.postalCode);
      }
    );

    // ============================================================
    // TC-CHECKOUT-004: Submitting checkout info with Last Name left
    // blank shows the required-field error and retains the other
    // entered values
    // ============================================================
    test(
      '[TC-CHECKOUT-004] checkout info with missing Last Name shows required-field error',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-004' }],
        tag: ['@negative'],
      },
      async ({ loggedInPage }) => {
        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BACKPACK);
        const cartPage = await loggedInPage.goToCart();
        const checkoutInfoPage = await cartPage.checkout();

        await checkoutInfoPage.continueExpectingFailure({
          firstName: PARTIAL_CHECKOUT_INFO.firstName,
          postalCode: PARTIAL_CHECKOUT_INFO.postalCode,
        });

        await expect(checkoutInfoPage.errorMessage).toHaveText(CHECKOUT_ERRORS.LAST_NAME_REQUIRED);
        await expect(checkoutInfoPage.firstNameInput).toHaveValue(PARTIAL_CHECKOUT_INFO.firstName);
        await expect(checkoutInfoPage.postalCodeInput).toHaveValue(PARTIAL_CHECKOUT_INFO.postalCode);
      }
    );

    // ============================================================
    // TC-CHECKOUT-005: Submitting checkout info with Postal Code
    // left blank shows the required-field error and retains the
    // other entered values
    // ============================================================
    test(
      '[TC-CHECKOUT-005] checkout info with missing Postal Code shows required-field error',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-005' }],
        tag: ['@negative'],
      },
      async ({ loggedInPage }) => {
        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BACKPACK);
        const cartPage = await loggedInPage.goToCart();
        const checkoutInfoPage = await cartPage.checkout();

        await checkoutInfoPage.continueExpectingFailure({
          firstName: PARTIAL_CHECKOUT_INFO.firstName,
          lastName: PARTIAL_CHECKOUT_INFO.lastName,
        });

        await expect(checkoutInfoPage.errorMessage).toHaveText(CHECKOUT_ERRORS.POSTAL_CODE_REQUIRED);
        await expect(checkoutInfoPage.firstNameInput).toHaveValue(PARTIAL_CHECKOUT_INFO.firstName);
        await expect(checkoutInfoPage.lastNameInput).toHaveValue(PARTIAL_CHECKOUT_INFO.lastName);
      }
    );

    // ============================================================
    // TC-CHECKOUT-006: The checkout overview page shows the cart
    // item with a correctly calculated subtotal, tax, and total
    // ============================================================
    test(
      '[TC-CHECKOUT-006] checkout overview displays cart items with correct subtotal, tax, and total',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-006' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const expectedBackpack = getExpectedProduct(CATALOG_PRODUCTS.BACKPACK);
        const subtotal = Number.parseFloat(expectedBackpack.price.replace('$', ''));
        const tax = calculateTax(subtotal);
        const total = subtotal + tax;

        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BACKPACK);
        const cartPage = await loggedInPage.goToCart();
        const checkoutInfoPage = await cartPage.checkout();
        const overviewPage = await checkoutInfoPage.continueCheckout(validCheckoutInfo());

        await expect(overviewPage.cartItems).toHaveCount(1);
        await expect(overviewPage.subtotalLabel).toHaveText(`Item total: ${formatCurrency(subtotal)}`);
        await expect(overviewPage.taxLabel).toHaveText(`Tax: ${formatCurrency(tax)}`);
        await expect(overviewPage.totalLabel).toHaveText(`Total: ${formatCurrency(total)}`);
      }
    );

    // ============================================================
    // TC-CHECKOUT-007: Clicking Finish on the checkout overview page
    // completes the purchase and shows the order-confirmation page
    // ============================================================
    test(
      '[TC-CHECKOUT-007] completing purchase from overview reaches the order-confirmation page',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-007' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BACKPACK);
        const cartPage = await loggedInPage.goToCart();
        const checkoutInfoPage = await cartPage.checkout();
        const overviewPage = await checkoutInfoPage.continueCheckout(validCheckoutInfo());

        const completePage = await overviewPage.finish();

        await expect(loggedInPage.currentPage).toHaveURL(CheckoutCompletePage.url);
        await expect(completePage.completeHeader).toHaveText(CHECKOUT_COMPLETE_HEADER);
        await expect(completePage.completeText).toHaveText(CHECKOUT_COMPLETE_TEXT);
      }
    );

    // ============================================================
    // TC-CHECKOUT-008: The cart badge is cleared after a completed
    // purchase
    // ============================================================
    test(
      '[TC-CHECKOUT-008] cart badge is cleared after a completed purchase',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-008' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BACKPACK);
        const cartPage = await loggedInPage.goToCart();
        const checkoutInfoPage = await cartPage.checkout();
        const overviewPage = await checkoutInfoPage.continueCheckout(validCheckoutInfo());

        await overviewPage.finish();

        await expect(loggedInPage.cartLink).not.toHaveText(/\d/);
      }
    );

    // ============================================================
    // TC-CHECKOUT-009: Cancelling from the checkout information page
    // returns to the cart page with its contents preserved
    // ============================================================
    test(
      '[TC-CHECKOUT-009] cancel from checkout info page returns to cart with contents preserved',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-009' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BACKPACK);
        const cartPage = await loggedInPage.goToCart();
        const checkoutInfoPage = await cartPage.checkout();

        const returnedCartPage = await checkoutInfoPage.cancel();

        await expect(loggedInPage.currentPage).toHaveURL(CartPage.url);
        await expect(returnedCartPage.cartItems).toHaveCount(1);
      }
    );

    // ============================================================
    // TC-CHECKOUT-010: Cancelling from the checkout overview page
    // returns to the inventory page with the cart contents preserved
    // ============================================================
    test(
      '[TC-CHECKOUT-010] cancel from checkout overview page returns to inventory with cart contents preserved',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-010' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BACKPACK);
        const cartPage = await loggedInPage.goToCart();
        const checkoutInfoPage = await cartPage.checkout();
        const overviewPage = await checkoutInfoPage.continueCheckout(validCheckoutInfo());

        const inventoryPage = await overviewPage.cancel();

        await expect(loggedInPage.currentPage).toHaveURL(InventoryPage.url);
        await expect(inventoryPage.cartLink).toHaveText('1');
      }
    );

    // ============================================================
    // TC-CHECKOUT-011: The checkout overview page calculates an
    // accurate subtotal, tax, and total for multiple items with
    // different prices
    // ============================================================
    test(
      '[TC-CHECKOUT-011] order total calculation is accurate for multiple items with different prices',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-011' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const backpack = getExpectedProduct(CATALOG_PRODUCTS.BACKPACK);
        const bikeLight = getExpectedProduct(CATALOG_PRODUCTS.BIKE_LIGHT);
        const subtotal =
          Number.parseFloat(backpack.price.replace('$', '')) + Number.parseFloat(bikeLight.price.replace('$', ''));
        const tax = calculateTax(subtotal);
        const total = subtotal + tax;

        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BACKPACK);
        await loggedInPage.addProductToCart(CATALOG_PRODUCTS.BIKE_LIGHT);
        const cartPage = await loggedInPage.goToCart();
        const checkoutInfoPage = await cartPage.checkout();
        const overviewPage = await checkoutInfoPage.continueCheckout(validCheckoutInfo());

        await expect(overviewPage.cartItems).toHaveCount(2);
        await expect(overviewPage.subtotalLabel).toHaveText(`Item total: ${formatCurrency(subtotal)}`);
        await expect(overviewPage.taxLabel).toHaveText(`Tax: ${formatCurrency(tax)}`);
        await expect(overviewPage.totalLabel).toHaveText(`Total: ${formatCurrency(total)}`);
      }
    );

    // ============================================================
    // TC-CHECKOUT-012: Clicking Checkout with an empty cart still
    // navigates to the checkout info page, with no cart items shown
    // on the eventual overview page
    // ============================================================
    test(
      '[TC-CHECKOUT-012] clicking checkout with an empty cart navigates to checkout info page',
      {
        annotation: [{ type: 'test-case', description: 'TC-CHECKOUT-012' }],
        tag: ['@negative'],
      },
      async ({ loggedInPage }) => {
        const cartPage = await loggedInPage.goToCart();
        await expect(cartPage.cartItems).toHaveCount(0);

        const checkoutInfoPage = await cartPage.checkout();

        await expect(loggedInPage.currentPage).toHaveURL(CheckoutInfoPage.url);
        await expect(checkoutInfoPage.firstNameInput).toBeVisible();
      }
    );
  }
);
