import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';

test('valid login redirects to inventory page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();

  const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.inventoryContainer).toBeVisible();
});

test('invalid password shows error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();

  await loginPage.loginExpectingFailure('standard_user', 'wrong_password');

  await expect(page).toHaveURL('/');
  await expect(loginPage.errorMessage).toHaveText(
    'Epic sadface: Username and password do not match any user in this service'
  );
});
