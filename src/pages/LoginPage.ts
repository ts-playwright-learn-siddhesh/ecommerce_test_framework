import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { InventoryPage } from './InventoryPage.ts';

export class LoginPage extends BasePage {
  readonly usernameInput = this.locatorForDataTest('username');
  readonly passwordInput = this.locatorForDataTest('password');
  readonly loginButton = this.locatorForDataTest('login-button');
  readonly errorMessage = this.locatorForDataTest('error');

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
}
