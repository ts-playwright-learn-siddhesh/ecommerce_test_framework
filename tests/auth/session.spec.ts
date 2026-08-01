import { test, expect } from '../../src/fixtures/test-base.js';
import { users } from '../../src/fixtures/users.fixture.js';

test.describe(
  'Authentication — Session',
  {
    tag: ['@authentication'],
  },
  () => {
    // ============================================================
    // TC-STATE-001: Logging out from the inventory page via the sidebar
    // menu clears the session and redirects back to the login page with
    // the username input visible
    // ============================================================
    test(
      '[TC-STATE-001] logout clears session and redirects to login',
      {
        annotation: [{ type: 'test-case', description: 'TC-STATE-001' }],
        tag: ['@smoke', '@positive'],
      },
      async ({ loggedInPage }) => {
        const page = loggedInPage.currentPage;
        const loggedOutPage = await loggedInPage.logout();

        await expect(page).toHaveURL('/');
        await expect(loggedOutPage.usernameInput).toBeVisible();
      }
    );

    // ============================================================
    // TC-STATE-002: Reloading the inventory page while logged in keeps
    // the session active, staying on /inventory.html with the inventory
    // container still visible
    // ============================================================
    test(
      '[TC-STATE-002] session persists across page reload',
      {
        annotation: [{ type: 'test-case', description: 'TC-STATE-002' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const page = loggedInPage.currentPage;
        await page.reload();

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(loggedInPage.inventoryContainer).toBeVisible();
      }
    );

    // ============================================================
    // TC-STATE-003: Clearing the session cookie mid-session and then
    // navigating to /inventory.html is treated the same as never having
    // logged in, redirecting to the login page with the same access error
    // ============================================================
    test(
      '[TC-STATE-003] expired session redirects to login with error on next navigation',
      {
        annotation: [{ type: 'test-case', description: 'TC-STATE-003' }],
        tag: ['@negative'],
      },
      async ({ page, context, loginPage }) => {
        await loginPage.login(users.standardUser.username, users.standardUser.password);

        await context.clearCookies();
        await page.goto('/inventory.html');

        await expect(page).toHaveURL('/');
        await expect(loginPage.errorMessage).toHaveText(
          "Epic sadface: You can only access '/inventory.html' when you are logged in."
        );
      }
    );

    // ============================================================
    // TC-STATE-004: Logging out from the cart page (not the inventory
    // page) via the sidebar menu still clears the session and redirects
    // back to the login page with the username input visible
    // ============================================================
    test(
      '[TC-STATE-004] logout from cart page clears session and redirects to login',
      {
        annotation: [{ type: 'test-case', description: 'TC-STATE-004' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const page = loggedInPage.currentPage;
        await loggedInPage.addBackpackToCart();
        const cartPage = await loggedInPage.goToCart();

        await expect(page).toHaveURL(/cart\.html/);
        await expect(cartPage.cartContentsContainer).toBeVisible();

        const loggedOutPage = await cartPage.logout();

        await expect(page).toHaveURL('/');
        await expect(loggedOutPage.usernameInput).toBeVisible();
      }
    );

    // ============================================================
    // TC-STATE-005: Adding an item to the cart, navigating to the cart
    // page, then navigating back keeps the session active and returns
    // to the inventory page with its container still visible
    // ============================================================
    test(
      '[TC-STATE-005] session stays active during navigation',
      {
        annotation: [{ type: 'test-case', description: 'TC-STATE-005' }],
        tag: ['@positive'],
      },
      async ({ loggedInPage }) => {
        const page = loggedInPage.currentPage;

        await loggedInPage.addBackpackToCart();
        const cartPage = await loggedInPage.goToCart();
        await expect(page).toHaveURL(/cart\.html/);
        await expect(cartPage.cartContentsContainer).toBeVisible();

        await page.goBack();
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(loggedInPage.inventoryContainer).toBeVisible();
      }
    );

    // ============================================================
    // TC-STATE-006: Logging in with problem_user's credentials succeeds
    // and reaches /inventory.html with the inventory container visible,
    // same as a standard user
    // ============================================================
    test(
      '[TC-STATE-006] login with problem_user reaches inventory page',
      {
        annotation: [{ type: 'test-case', description: 'TC-STATE-006' }],
        tag: ['@positive'],
      },
      async ({ page, loginPage }) => {
        const inventoryPage = await loginPage.login(users.problemUser.username, users.problemUser.password);

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(inventoryPage.inventoryContainer).toBeVisible();
      }
    );

    // ============================================================
    // TC-STATE-007: Logging in with performance_glitch_user's credentials
    // succeeds and reaches /inventory.html with the inventory container
    // visible, same as a standard user, though the login may be slower
    // ============================================================
    test(
      '[TC-STATE-007] login with performance_glitch_user reaches inventory page',
      {
        annotation: [{ type: 'test-case', description: 'TC-STATE-007' }],
        tag: ['@positive'],
      },
      async ({ page, loginPage }) => {
        const inventoryPage = await loginPage.login(
          users.performanceGlitchUser.username,
          users.performanceGlitchUser.password
        );

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(inventoryPage.inventoryContainer).toBeVisible();
      }
    );
  }
);
