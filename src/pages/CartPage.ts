import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { LoginPage } from './LoginPage.ts';
import { SidebarMenu } from './SidebarMenu.ts';

export class CartPage extends BasePage {
  readonly cartContentsContainer = this.locatorForDataTest('cart-contents-container');
  private readonly sidebarMenu = new SidebarMenu(this.page);

  constructor(page: Page) {
    super(page);
  }

  async logout(): Promise<LoginPage> {
    await this.sidebarMenu.logout();
    return new LoginPage(this.page);
  }
}
