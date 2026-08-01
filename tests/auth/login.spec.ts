import { test, expect } from '../../src/fixtures/test-base.js';
import { users } from '../../src/fixtures/users.fixture.js';

test.describe(
  'Authentication — Login',
  {
    tag: ['@authentication'],
  },
  () => {
    // ============================================================
    // TC-AUTH-001: Valid login with standard_user's credentials redirects
    // from the login page to /inventory.html with the inventory container visible
    // ============================================================
    test(
      '[TC-AUTH-001] valid login redirects to inventory page',
      {
        annotation: [{ type: 'test-case', description: 'TC-AUTH-001' }],
        tag: ['@smoke', '@positive'],
      },
      async ({ page, loginPage }) => {
        const inventoryPage = await loginPage.login(users.standardUser.username, users.standardUser.password);

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(inventoryPage.inventoryContainer).toBeVisible();
      }
    );

    // ============================================================
    // TC-AUTH-002 to TC-AUTH-007: Invalid username, invalid password,
    // locked-out user, empty username, empty password, and both fields
    // empty each submit the login form and stay on the login page with
    // the matching "Epic sadface" error message shown
    // ============================================================
    const invalidLoginCases = [
      {
        testCaseId: 'TC-AUTH-002',
        description: 'invalid username',
        username: 'invalid_user',
        password: users.standardUser.password,
        expectedError: 'Epic sadface: Username and password do not match any user in this service',
      },
      {
        testCaseId: 'TC-AUTH-003',
        description: 'invalid password',
        username: users.standardUser.username,
        password: 'wrong_password',
        expectedError: 'Epic sadface: Username and password do not match any user in this service',
      },
      {
        testCaseId: 'TC-AUTH-004',
        description: 'locked-out user',
        username: users.lockedOutUser.username,
        password: users.lockedOutUser.password,
        expectedError: 'Epic sadface: Sorry, this user has been locked out.',
      },
      {
        testCaseId: 'TC-AUTH-005',
        description: 'empty username',
        username: '',
        password: users.standardUser.password,
        expectedError: 'Epic sadface: Username is required',
      },
      {
        testCaseId: 'TC-AUTH-006',
        description: 'empty password',
        username: users.standardUser.username,
        password: '',
        expectedError: 'Epic sadface: Password is required',
      },
      {
        testCaseId: 'TC-AUTH-007',
        description: 'both fields empty',
        username: '',
        password: '',
        expectedError: 'Epic sadface: Username is required',
      },
    ];

    for (const { testCaseId, description, username, password, expectedError } of invalidLoginCases) {
      test(
        `[${testCaseId}] ${description} shows error`,
        {
          annotation: [{ type: 'test-case', description: testCaseId }],
          tag: ['@negative'],
        },
        async ({ page, loginPage }) => {
          await loginPage.loginExpectingFailure(username, password);

          await expect(page).toHaveURL('/');
          await expect(loginPage.errorMessage).toHaveText(expectedError);
        }
      );
    }

    // ============================================================
    // TC-AUTH-008: Navigating directly to /inventory.html without an
    // authenticated session redirects back to the login page with the
    // "you can only access it when logged in" error shown
    // ============================================================
    test(
      '[TC-AUTH-008] direct URL access to inventory without login redirects with error',
      {
        annotation: [{ type: 'test-case', description: 'TC-AUTH-008' }],
        tag: ['@negative'],
      },
      async ({ page, loginPage }) => {
        await page.goto('/inventory.html');

        await expect(page).toHaveURL('/');
        await expect(loginPage.errorMessage).toHaveText(
          "Epic sadface: You can only access '/inventory.html' when you are logged in."
        );
      }
    );

    // ============================================================
    // TC-AUTH-009: After a failed login shows an error message,
    // clicking the error's dismiss ("X") button hides the error so
    // the login form can be used again
    // ============================================================
    test(
      '[TC-AUTH-009] error message can be dismissed',
      {
        annotation: [{ type: 'test-case', description: 'TC-AUTH-009' }],
        tag: ['@negative'],
      },
      async ({ loginPage }) => {
        await loginPage.loginExpectingFailure(users.standardUser.username, 'wrong_password');
        await expect(loginPage.errorMessage).toBeVisible();

        await loginPage.dismissError();

        await expect(loginPage.errorMessage).toBeHidden();
      }
    );
  }
);
