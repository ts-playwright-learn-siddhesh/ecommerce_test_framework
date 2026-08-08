import { test as base } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage.ts';
import { InventoryPage } from '@/pages/InventoryPage.ts';

export const test = base.extend<{ loginPage: LoginPage; loggedInPage: InventoryPage }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await use(loginPage);
  },

  loggedInPage: async ({ page }, use) => {
    await page.goto('/inventory.html');
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
