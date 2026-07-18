import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { LoginPage } from './LoginPage.js';

export class InventoryPage extends BasePage {
  readonly inventoryContainer = this.locatorForDataTest('inventory-container');
  readonly menuButton = this.page.locator('#react-burger-menu-btn');
  readonly logoutLink = this.locatorForDataTest('logout-sidebar-link');

  constructor(page: Page) {
    super(page);
  }

  async logout(): Promise<LoginPage> {
    await this.menuButton.click();
    await this.logoutLink.click();
    return new LoginPage(this.page);
  }
}
