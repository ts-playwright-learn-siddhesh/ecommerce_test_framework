import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';

export class CartPage extends BasePage {
  static readonly url = /cart\.html/;

  readonly cartContentsContainer = this.locatorForDataTest('cart-contents-container');
  readonly cartItems = this.locatorForDataTest('inventory-item');

  constructor(page: Page) {
    super(page);
  }

  cartItemRow(productName: string): Locator {
    return this.cartItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
  }

  async getItemPrice(productName: string): Promise<string> {
    return (await this.cartItemRow(productName).locator('[data-test="inventory-item-price"]').textContent()) ?? '';
  }

  async getItemQuantity(productName: string): Promise<string> {
    return (await this.cartItemRow(productName).locator('[data-test="item-quantity"]').textContent()) ?? '';
  }
}
