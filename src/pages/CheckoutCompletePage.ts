import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { InventoryPage } from './InventoryPage.ts';

export class CheckoutCompletePage extends BasePage {
  static readonly url = /checkout-complete\.html/;

  readonly completeContainer = this.locatorForDataTest('checkout-complete-container');
  readonly completeHeader = this.locatorForDataTest('complete-header');
  readonly completeText = this.locatorForDataTest('complete-text');
  readonly backToProductsButton = this.locatorForDataTest('back-to-products');

  constructor(page: Page) {
    super(page);
  }

  async backToProducts(): Promise<InventoryPage> {
    await this.backToProductsButton.click();
    await this.page.waitForURL(InventoryPage.url);
    return new InventoryPage(this.page);
  }
}
