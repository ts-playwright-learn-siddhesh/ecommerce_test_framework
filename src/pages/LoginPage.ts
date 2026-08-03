import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { InventoryPage } from './InventoryPage.js';

export const INVENTORY_ACCESS_DENIED_ERROR =
  "Epic sadface: You can only access '/inventory.html' when you are logged in.";

export class LoginPage extends BasePage {
  readonly usernameInput = this.locatorForDataTest('username');
  readonly passwordInput = this.locatorForDataTest('password');
  readonly loginButton = this.locatorForDataTest('login-button');
  readonly errorMessage = this.locatorForDataTest('error');
  readonly errorDismissButton = this.locatorForDataTest('error-button');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('/');
  }

  async login(username: string, password: string): Promise<InventoryPage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    return new InventoryPage(this.page);
  }

  async loginExpectingFailure(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async dismissError(): Promise<void> {
    await this.errorDismissButton.click();
  }
}
