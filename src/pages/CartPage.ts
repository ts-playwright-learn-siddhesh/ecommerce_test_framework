import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { CheckoutInfoPage } from './CheckoutInfoPage.ts';

export class CartPage extends BasePage {
  static readonly url = /cart\.html/;

  readonly cartContentsContainer = this.locatorForDataTest('cart-contents-container');
  readonly cartItems = this.locatorForDataTest('inventory-item');
  readonly checkoutButton = this.locatorForDataTest('checkout');
  readonly continueShoppingButton = this.locatorForDataTest('continue-shopping');

  constructor(page: Page) {
    super(page);
  }

  itemName(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-name"]');
  }

  itemPrice(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-price"]');
  }

  itemQuantity(item: Locator): Locator {
    return item.locator('[data-test="item-quantity"]');
  }

  async checkout(): Promise<CheckoutInfoPage> {
    await this.checkoutButton.click();
    await this.page.waitForURL(CheckoutInfoPage.url);
    return new CheckoutInfoPage(this.page);
  }
}
