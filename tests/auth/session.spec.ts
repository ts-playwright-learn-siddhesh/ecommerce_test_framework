import { test, expect } from '../../src/fixtures/test-base.js';
import { users } from '../../src/fixtures/users.fixture.js';


// ============================================================
// Logout clears session and redirects to login
// ============================================================
test('logout clears session and redirects to login', async ({ page, loginPage }) => {
  const inventoryPage = await loginPage.login(users.standardUser.username, users.standardUser.password);

  const loggedOutPage = await inventoryPage.logout();

  await expect(page).toHaveURL('/');
  await expect(loggedOutPage.usernameInput).toBeVisible();
});
