import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';

export const test = base.extend<{ loginPage: LoginPage; loggedInPage: InventoryPage }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await use(loginPage);
  },

  loggedInPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const page = await context.newPage();
    await page.goto('/inventory.html');
    await use(new InventoryPage(page));
    await context.close();
  },
});

export { expect } from '@playwright/test';
