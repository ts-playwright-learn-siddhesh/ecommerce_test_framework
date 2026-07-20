import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { LoginPage } from './LoginPage.js';
import { CartPage } from './CartPage.js';
import { SidebarMenu } from './SidebarMenu.js';

export class InventoryPage extends BasePage {
  readonly inventoryContainer = this.locatorForDataTest('inventory-container');
  readonly addBackpackToCartButton = this.locatorForDataTest('add-to-cart-sauce-labs-backpack');
  readonly cartLink = this.locatorForDataTest('shopping-cart-link');
  private readonly sidebarMenu = new SidebarMenu(this.page);

  constructor(page: Page) {
    super(page);
  }

  async logout(): Promise<LoginPage> {
    await this.sidebarMenu.logout();
    return new LoginPage(this.page);
  }

  async addBackpackToCart(): Promise<void> {
    await this.addBackpackToCartButton.click();
  }

  async goToCart(): Promise<CartPage> {
    await this.cartLink.click();
    return new CartPage(this.page);
  }
}
