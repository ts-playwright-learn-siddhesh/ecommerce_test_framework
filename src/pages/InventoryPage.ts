import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { CartPage } from './CartPage.ts';

export class InventoryPage extends BasePage {
  static readonly url = /inventory\.html/;

  readonly inventoryContainer = this.locatorForDataTest('inventory-container');
  readonly title = this.locatorForDataTest('title');
  readonly inventoryItems = this.locatorForDataTest('inventory-item');
  readonly addBackpackToCartButton = this.locatorForDataTest('add-to-cart-sauce-labs-backpack');
  readonly cartLink = this.locatorForDataTest('shopping-cart-link');

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/inventory.html');
  }

  async addBackpackToCart(): Promise<void> {
    await this.addBackpackToCartButton.click();
  }

  async goToCart(): Promise<CartPage> {
    await this.cartLink.click();
    return new CartPage(this.page);
  }

  itemImage(item: Locator): Locator {
    return item.locator('img');
  }

  itemName(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-name"]');
  }

  itemDescription(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-desc"]');
  }

  itemPrice(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-price"]');
  }

  itemAddToCartButton(item: Locator): Locator {
    return item.getByRole('button', { name: 'Add to cart' });
  }

  get itemNames(): Locator {
    return this.itemName(this.inventoryItems);
  }

  get itemPrices(): Locator {
    return this.itemPrice(this.inventoryItems);
  }
}
