import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { InventoryPage } from './InventoryPage.ts';

export class ProductDetailPage extends BasePage {
  static readonly url = /inventory-item\.html\?id=/;

  readonly image = this.page.locator('img.inventory_details_img');
  readonly name = this.locatorForDataTest('inventory-item-name');
  readonly description = this.locatorForDataTest('inventory-item-desc');
  readonly price = this.locatorForDataTest('inventory-item-price');
  readonly addToCartButton = this.page.getByRole('button', { name: 'Add to cart' });
  readonly backToProductsButton = this.locatorForDataTest('back-to-products');

  constructor(page: Page) {
    super(page);
  }

  async backToProducts(): Promise<InventoryPage> {
    await this.backToProductsButton.click();
    return new InventoryPage(this.page);
  }
}
