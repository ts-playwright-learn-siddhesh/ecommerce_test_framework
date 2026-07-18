import { test, expect } from '../../src/fixtures/test-base.js';
import { users } from '../../src/fixtures/users.fixture.js';


// ============================================================
// Valid login redirects to inventory page
// ============================================================
test('valid login redirects to inventory page', async ({ page, loginPage }) => {
  const inventoryPage = await loginPage.login(users.standardUser.username, users.standardUser.password);

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.inventoryContainer).toBeVisible();
});


// ============================================================
// Negative login cases: wrong credentials, locked-out user,
// and empty-field validation all produce an error message
// while staying on the login page.
// ============================================================
const invalidLoginCases = [
  {
    description: 'invalid password',
    username: users.standardUser.username,
    password: 'wrong_password',
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    description: 'locked-out user',
    username: users.lockedOutUser.username,
    password: users.lockedOutUser.password,
    expectedError: 'Epic sadface: Sorry, this user has been locked out.',
  },
  {
    description: 'empty username',
    username: '',
    password: users.standardUser.password,
    expectedError: 'Epic sadface: Username is required',
  },
  {
    description: 'empty password',
    username: users.standardUser.username,
    password: '',
    expectedError: 'Epic sadface: Password is required',
  },
];

for (const { description, username, password, expectedError } of invalidLoginCases) {
  test(`${description} shows error`, async ({ page, loginPage }) => {
    await loginPage.loginExpectingFailure(username, password);

    await expect(page).toHaveURL('/');
    await expect(loginPage.errorMessage).toHaveText(expectedError);
  });
}


// ============================================================
// Direct URL access to inventory without login redirects
// back to the login page with an error
// ============================================================
test('direct URL access to inventory without login redirects with error', async ({ page, loginPage }) => {
  await page.goto('/inventory.html');

  await expect(page).toHaveURL('/');
  await expect(loginPage.errorMessage).toHaveText(
    "Epic sadface: You can only access '/inventory.html' when you are logged in."
  );
});
