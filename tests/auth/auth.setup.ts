import { test as setup } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage.ts';
import { users } from '@/fixtures/users.fixture.ts';

const authFile = 'playwright/.auth/user.json';

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(users.standardUser.username, users.standardUser.password);

  await page.context().storageState({ path: authFile });
});
