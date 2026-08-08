import type { Page } from '@playwright/test';
import { AuthenticatedPage } from './AuthenticatedPage.ts';
import { CartPage } from './CartPage.ts';

export class InventoryPage extends AuthenticatedPage  {
  readonly inventoryContainer = this.locatorForDataTest('inventory-container');
  readonly addBackpackToCartButton = this.locatorForDataTest('add-to-cart-sauce-labs-backpack');
  readonly cartLink = this.locatorForDataTest('shopping-cart-link');

  constructor(page: Page) {
    super(page);
  }

  async addBackpackToCart(): Promise<void> {
    await this.addBackpackToCartButton.click();
  }

  async goToCart(): Promise<CartPage> {
    await this.cartLink.click();
    return new CartPage(this.page);
  }
}
