import type { Page } from '@playwright/test';
<<<<<<< HEAD
import { BasePage } from './BasePage.ts';
import { LoginPage } from './LoginPage.ts';
import { CartPage } from './CartPage.ts';
import { SidebarMenu } from './SidebarMenu.ts';
=======
import { BasePage } from './BasePage.js';
import { CartPage } from './CartPage.js';
>>>>>>> main

export class InventoryPage extends BasePage {
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
