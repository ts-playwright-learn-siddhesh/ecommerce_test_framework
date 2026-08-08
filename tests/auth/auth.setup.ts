import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage.ts';
import { users } from '@/fixtures/users.fixture.ts';

const authFile = 'playwright/.auth/user.json';

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  const inventoryPage = await loginPage.login(
    users.standardUser.username, 
    users.standardUser.password
  );

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.inventoryContainer).toBeVisible();

  await page.context().storageState({ path: authFile });
});
