import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import type { InventoryPage } from '../pages/InventoryPage.js';
import { users } from './users.fixture.js';

export const test = base.extend<{ loginPage: LoginPage; loggedInPage: InventoryPage }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await use(loginPage);
  },

  loggedInPage: async ({ loginPage }, use) => {
    const inventoryPage = await loginPage.login(users.standardUser.username, users.standardUser.password);
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
