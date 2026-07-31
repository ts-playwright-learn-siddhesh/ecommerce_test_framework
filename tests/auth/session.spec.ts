import { test, expect } from '../../src/fixtures/test-base.ts';
import { users } from '../../src/fixtures/users.fixture.ts';


// ============================================================
// Logout clears session and redirects to login
// ============================================================
test('logout clears session and redirects to login', async ({ loggedInPage }) => {
  const page = loggedInPage.currentPage;
  const loggedOutPage = await loggedInPage.logout();

  await expect(page).toHaveURL('/');
  await expect(loggedOutPage.usernameInput).toBeVisible();
});


// ============================================================
// Session persists across page reload
// ============================================================
test('session persists across page reload', async ({ loggedInPage }) => {
  const page = loggedInPage.currentPage;
  await page.reload();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(loggedInPage.inventoryContainer).toBeVisible();
});


// ============================================================
// Session expires/invalidates correctly: clearing the session
// cookie mid-session is treated the same as never having logged in
// ============================================================
test('expired session redirects to login with error on next navigation', async ({ page, context, loginPage }) => {
  await loginPage.login(users.standardUser.username, users.standardUser.password);

  await context.clearCookies();
  await page.goto('/inventory.html');

  await expect(page).toHaveURL('/');
  await expect(loginPage.errorMessage).toHaveText(
    "Epic sadface: You can only access '/inventory.html' when you are logged in."
  );
});


// ============================================================
// Logout from a non-inventory page (cart) still clears session
// correctly, same as logging out from the inventory page
// ============================================================
test('logout from cart page clears session and redirects to login', async ({ loggedInPage }) => {
  const page = loggedInPage.currentPage;
  await loggedInPage.addBackpackToCart();
  const cartPage = await loggedInPage.goToCart();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(cartPage.cartContentsContainer).toBeVisible();

  const loggedOutPage = await cartPage.logout();

  await expect(page).toHaveURL('/');
  await expect(loggedOutPage.usernameInput).toBeVisible();
});
