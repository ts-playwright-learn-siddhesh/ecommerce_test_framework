import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { LoginPage } from './LoginPage.js';

export class CartPage extends BasePage {
  readonly cartContentsContainer = this.locatorForDataTest('cart-contents-container');
  readonly menuButton = this.page.locator('#react-burger-menu-btn');
  readonly logoutLink = this.locatorForDataTest('logout-sidebar-link');

  constructor(page: Page) {
    super(page);
  }

  async logout(): Promise<LoginPage> {
    await this.page.addStyleTag({ content: '.bm-menu-wrap, .bm-menu { transition: none !important; }' });
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
    return new LoginPage(this.page);
  }
}
