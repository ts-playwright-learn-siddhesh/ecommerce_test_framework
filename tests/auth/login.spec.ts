import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';

test('valid login redirects to inventory page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();

  const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.inventoryContainer).toBeVisible();
});
